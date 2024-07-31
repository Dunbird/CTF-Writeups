## Task 1 *To accurately reference and identify the suspicious binary, please provide its SHA256 hash.*
----
 Simply unzip the provided zip file and run:
	 `sha256sum Superstar_MemberCard.tiff.exe`
  
		`12daa34111bb54b3dcbad42305663e44e7e6c3842f015cccbbe6564d9dfd3ea3`
  
## Task 2 *When was the binary file originally created, according to its metadata (UTC)?*
----
 We can get this information from files using **Exiftool:**
 
![screenshot1](https://github.com/Dunbird/CTF-Writeups/blob/main/Heartbreaker-Continuum/Pasted%20image%2020240730215236.png?raw=true)
 
The information we are looking for is the `Time Stamp` value. Just be sure to convert it into UTC format as the task requires.

	`2024-03-13 10:38:06`

## Task 3 *Examining the code size in a binary file can give indications about its functionality. Could you specify the byte size of the code in this binary?*
----
We can do this by finding what section of the binary is used to store the code. A bit of simple research shows us that it is stored in the `.text` section of the binary. 

We can then make a simple Python script using `pefile` to find the value of the byte size of that section.  *We are looking for the raw size of that section.*

	 `38400` bytes

## Task 4 *It appears that the binary may have undergone a file conversion process. Could you determine its original filename?*
----
Digging into the file will be our best course of action.
After looking at the strings found within the file, we come across the file name 

![screenshot2](https://github.com/Dunbird/CTF-Writeups/blob/main/Heartbreaker-Continuum/Pasted%20image%2020240730155256.png?raw=true)

	`newILY.ps1`

## Task 5 *Specify the hexadecimal offset where the obfuscated code of the identified original file begins in the binary.*
----
I approached this using [Autopsy](https://www.autopsy.com/) to have a clear view of the text from the file. 

From there, we see what is clearly obfuscated script 

![screenshot3](https://github.com/Dunbird/CTF-Writeups/blob/main/Heartbreaker-Continuum/Pasted%20image%2020240730155836.png?raw=true)

Now, we need to find the hexadecimal offset of this. An easy way to do this is to use `PE-Bear` and search for this text since it provides the offset of where it is found. 

![screeshot4](https://github.com/Dunbird/CTF-Writeups/blob/main/Heartbreaker-Continuum/Pasted%20image%2020240730160155.png?raw=true)
  
	`Offset: 2C74` 
	 

## Task 6 *The threat actor concealed the plaintext script within the binary. Can you provide the encoding method used for this obfuscation?*
----
From looking at the obfuscated script, we can see that it is clearly encoded with `Base64` 

## Task 7 *What is the specific cmdlet utilized to initiate file downloads?*
----
To do this, we should begin to deobfuscate the previously found script. 

Taking a quick look at it, we can see that it clearly reverses Base64. 
We can easily deobfuscate this using [CyberChef](https://gchq.github.io/CyberChef/) 

![screenshot5](https://github.com/Dunbird/CTF-Writeups/blob/main/Heartbreaker-Continuum/Pasted%20image%2020240730203353.png?raw=true)

Looking at the result, we can investigate the cmdlet used to download the file. Luckily, it is pretty straightforward

![screenshot6](https://github.com/Dunbird/CTF-Writeups/blob/main/Heartbreaker-Continuum/Pasted%20image%2020240730164457.png?raw=true)

	`Invoke-WebRequest` 

## Task 8 *Could you identify any possible network-related Indicators of Compromise (IoCs) after examining the code? Separate IPs by commas in ascending order.*
----
This is pretty simple. Just have to look through the newly found script and find the IPs used to compromise. 
	`35.169.66.138, 44.206.187.144`

## Task 9 *The binary created a staging directory. Can you specify the location of this directory where the harvested files are stored?*
----
Looking through the script, we find a directory where the binary is storing files. 
After looking through the code, you will notice it using the variable `$targetDir`

From there we can find the value of it and get the directory being used
	`C:\Users\Public\Public Files` 

## Task 10 *What MITRE ID corresponds to the technique used by the malicious binary to autonomously gather data?*
----
To find this, we need to understand how the script collects data. 

After looking through it, you'll come across the following: 

![screenshot7](https://github.com/Dunbird/CTF-Writeups/blob/main/Heartbreaker-Continuum/Pasted%20image%2020240730173501.png?raw=true)
  
Here, you'll see how it utilizes file extensions to gather user data. 
According to MITRE ATT&CK, this would fall under `Automated Collection` 
	`T1119` 

## Task 11 *What is the password utilized to exfiltrate the collected files through the file transfer program within the binary?*
----
We must first see where this happens in the script to find the password used. 

We are looking for where the data is exfiltrated using FTP/SFTP. Here, we will see the following:

![screenshot8](https://github.com/Dunbird/CTF-Writeups/blob/main/Heartbreaker-Continuum/Pasted%20image%2020240730174457.png?raw=true)
 
Giving us the password:  **M8&C!i6KkmGL1-#** 
