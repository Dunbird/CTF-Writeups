# **SpottedInTheWind Write Up**
## Task 1 **In your investigation into the FinTrust Bank breach, you found an application that was the entry point for the attack. Which application was used to download the malicious file?**
Diving into the downloads folder, we see a folder named `Telegram Desktop.` 

## Task 2 **Finding out when the attack started is critical. What is the UTC timestamp for when the suspicious file was first downloaded?**
Looking back at the download directory, we see a .rar file. Looking into its metadata using Autopsy, we see that it has a creation time of:

`2024-02-03 07:33:20`

## Task 3 **Knowing which vulnerability was exploited is key to improving security. What is the CVE identifier of the vulnerability used in this attack?**
Looking back at the challenge description, we see  ***Preliminary analysis by the IT department has identified a potential compromise linked to an exploited vulnerability in WinRAR software.***

Clearly outlining that the vulnerability originates from WinRAR software. 
Additionally, investigating the malicious file, we see that it includes a .jpg within the archive. Possibly an indicator of the vulnerability.


![Task3.png](https://github.com/Dunbird/CTF-Writeups/blob/main/SpottedInTheWild/Task3.png)

From here its just a matter of looking through [WinRAR CVEs](https://www.cvedetails.com/vulnerability-list/vendor_id-1914/product_id-3768/Rarlab-Winrar.html). Which will provide us with the following CVE:
[CVE-2023-38831](https://www.cvedetails.com/cve/CVE-2023-38831/ "CVE-2023-38831 security vulnerability details")

![Task3 2.png](https://github.com/Dunbird/CTF-Writeups/blob/main/SpottedInTheWild/Task3%202.png)


## Task 4 **In examining the downloaded archive, you noticed a file with an odd extension, indicating it might be malicious. What is the name of this file?**
Opening up the WinRAR file shows us that there is a file within its name 
`SANS SEC401.pdf .cmd`

![Task4.png](https://github.com/Dunbird/CTF-Writeups/blob/main/SpottedInTheWild/Task4.png)

## Task 5 **Uncovering the payload delivery methods helps understand the attack vectors used. What URL is used by the attacker to download the second malware stage?**
Searching through the strings of that `.cmd` file will provide us with the following.


![Task5.png](https://github.com/Dunbird/CTF-Writeups/blob/main/SpottedInTheWild/Task5.png)

`http://172.18.35.10:8000/amanwhogetsnorest.jpg`

## Task 6 **To further understand how attackers cover their tracks, identify the script they used to tamper with the event logs. What is the script name?**
Similar to Task 5, we can find the PowerShell script used to tamper with the event logs by investigating through the strings. 


![Task6.png](https://github.com/Dunbird/CTF-Writeups/blob/main/SpottedInTheWild/Task6.png)

`Eventlogs.ps1`
## Task 7 **Knowing when unauthorized actions happened helps understand the attack. What is the UTC timestamp for when the script that tampered with event logs was run?**

From past investigation, we know that `Eventlogs.ps1` is used to clear audit logs from the system

Using this information, we can determine when the script was running, as it would create a [security log (1102)](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/).

Exporting and opening `Security.evtx` will show the following log.

```
|Audit Sucess|2024-02-02|23:38:01|1102|Microsoft-Windows-Eventlog| Log Clear|
```

Giving us: `2024-02-03 07:38:01` 

## Task 8 **We need to identify if the attacker maintained access to the machine. What is the command used by the attacker for persistence?**
This can be done by running the malicious file in a sandbox and monitoring the commands that are run using something like [CMD Watcher](https://www.kahusecurity.com/tools.html). 

Running the command and using CMD Watcher will provide us with the following command. 
```
schtasks /create /sc minute /mo 3 /tn "whoisthebaba" /tr C:\Windows\Temp\run.bat /RL HIGHEST
```
We can see it creating a scheduled task set to run every 3 minutes that'll run another script named `run.bat` with the highest privileges. 


![Task8.png](https://github.com/Dunbird/CTF-Writeups/blob/main/SpottedInTheWild/Task8.png)

## Task 9 **To understand the attacker's data exfiltration strategy, we must locate where they stored their harvested data. What is the full path of the file storing the data collected by one of the attacker's tools in preparation for data exfiltration?**

Investigating the command used for persistence will provide us with a new script named `run.bat.`

Opening the script location using Autopsy will show us an obfuscated script. A quick read will show it has been reversed and encoded using Base64. Decoding this script with [CyberChef](https://gchq.github.io/CyberChef/) will provide us with the script used by the attacker for exfiltration.


![Task9.png](https://github.com/Dunbird/CTF-Writeups/blob/main/SpottedInTheWild/Task9.png)

Reading through the script will provide us with the full path of the file storing the data collected.


![Task9 2.png](https://github.com/Dunbird/CTF-Writeups/blob/main/SpottedInTheWild/Task92.png)
