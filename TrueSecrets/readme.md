# TrueSecrets Writeup
##### CHALLENGE DESCRIPTION
*Our cybercrime unit has been investigating a well-known APT group for several months. The group has been responsible for several high-profile attacks on corporate organizations. However, what is interesting about that case, is that they have developed a custom command & control server of their own. Fortunately, our unit was able to raid the home of the leader of the APT group and take a memory capture of his computer while it was still powered on. Analyze the capture to try to find the source code of the server*
#### Files
**TrueSecrets.raw** - Memory dump of [command and control server](https://sysdig.com/learn-cloud-native/what-is-a-command-and-control-server/#:~:text=A%20Command%2Dand%2DControl%20server%20is%20a%20computer%20or%20set,or%20compromising%20attacker%20target%20systems.) 

----
Having this memory dump, the first course of action would be to work with [Volatility](https://github.com/volatilityfoundation/volatility) to identify the memory profile

![image1](https://github.com/Dunbird/CTF-Writeups/blob/main/TrueSecrets/Pasted%20image%2020240813130109.png)

The next action would be to identify the processes running since this memory dump was taken while the command and control server was running. From there, we should locate any interesting processes to investigate.


![pslist.png](https://github.com/Dunbird/CTF-Writeups/blob/main/TrueSecrets/pslist.png)

From investigating the processes in the memory capture, the one that sticks out the most is the TrueCrypt process. 

Research shows that [TrueCrypt](https://truecrypt.sourceforge.net/) is a discontinued utility used to encrypt disks, partitions, or storage devices. It also has a major vulnerability oversight, [where it stores the key to the encrypted drive in memory](https://www.truecrypt71a.com/documentation/security-requirements-and-precautions/data-leaks/memory-dump-files/).

Furthermore, there is a simple way to [recover the key and encrypted drive through Volatility](https://volatility-labs.blogspot.com/2014/01/truecrypt-master-key-extraction-and.html). This is clearly worth diving deeper into.

----

We can get the TrueCrypt information, including the key, through Volatility using the `truecryptsummary` plugin


![image2](https://github.com/Dunbird/CTF-Writeups/blob/main/TrueSecrets/Pasted%20image%2020240813140124.png)

The key information that we obtain is:
```
Password        X2Hk2XbEJqWYsh8VdbSYg6WpG9g7 
Container       Path: C:\Users\IEUser\Documents\development.tc
```


Now we know that `development.tc` is the file holding the encrypted drive. Now, we just need to recover this file from the dump. Thankfully, this file will be loaded onto the memory since it was actively used when the image was taken.

A simple way to get this file is to just extract all the cached files from memory using the `dumpfiles` plugin. 
Dumping cached files will return `backup_development.zip`, which can be assumed to be connected to `development.tc` as it has a similar name and is in the same directory.


![dumpfiles.png](https://github.com/Dunbird/CTF-Writeups/blob/main/TrueSecrets/dumpfiles.png)

Extracting this zip file will return us with `development.tc`

----

Now that we have the container file and the password, we can mount it to our system using TrueCrypt. Allowing us to view the contents of the encrypted drive. Within the drive we have a folder containing encrypted logs and the source code to the command and control server. 


![Pasted image 20240813145501.png](https://github.com/Dunbird/CTF-Writeups/blob/main/TrueSecrets/Pasted%20image%2020240813145501.png)

Investigating the `AgentServer.cs` file shows us that this is the source code for the command and control server. Within this source code, we see the encryption method used, along with the encryption key and IV.


![encryption.png](https://github.com/Dunbird/CTF-Writeups/blob/main/TrueSecrets/encryption.png)

The form of encryption is through DES into base64 with the following key and IV:
```
key = "AKaPdSgV"
iv = "QeThWmYq"
```

----
We can decrypt the logs by reversing this process using [CyberChef](https://gchq.github.io/CyberChef/), finally giving us the flag:
![decrypted.png](https://github.com/Dunbird/CTF-Writeups/blob/main/TrueSecrets/decrypted.png)
