## True Secrets Write Up
###### CHALLENGE DESCRIPTION
*Our cybercrime unit has been investigating a well-known APT group for several months. The group has been responsible for several high-profile attacks on corporate organizations. However, what is interesting about that case, is that they have developed a custom command & control server of their own. Fortunately, our unit was able to raid the home of the leader of the APT group and take a memory capture of his computer while it was still powered on. Analyze the capture to try to find the source code of the server*
#### Files
**TrueSecrets.raw** - Memory dump of computer 

----
Having this memory dump my first course of action would be to work with Volatility to identify the memory profile

![[Pasted image 20240813130109.png]]

The next course of action would be to identify the processes that were running since we know that this memory dump was taken while the Command and Control Server was running. From there we should identify any interesting processes to investigate.


![[pslist.png]]

From investigating the process in the memory capture the one that sticks out the most is this TrueCrypt process. 

Doing a bit of research shows that TrueCrypt is a discontinued utility used to encrypt a disk, partition or storage device. It also has a major vulnerability oversight where it stores the key to the encrypted drive onto memory.

Furthermore there is simple way to recover the key and encrypted drive through Volatility. This is clearly worth diving deeper into.

----

We can get TrueCrypt information, including the key through Volatility using the `truecryptsummary` plugin


![[Pasted image 20240813140124.png]]

The key information that we obtain is:
```
Password        X2Hk2XbEJqWYsh8VdbSYg6WpG9g7 
Container       Path: C:\Users\IEUser\Documents\development.tc
```


Now we know that `development.tc` is the file holding the encrypted drive. Now we just need to recover this file from the dump. Thankfully we know that this file will be loaded onto the memory since it was actively being used when the image was taken.

A simple way to get this file is to just extract all the cached files from memory using the `dumpfiles` plugin. 

![[dumpfiles.png]]

Dumping cached files will return `backup_development.zip` which can be assumed to be connected to `development.tc` as it has a similar name and is in the same directory as it.

Extracting this zip file will return us with `development.tc`

----

Now that we have the container file and the password we can mount it onto our system using TrueCrypt. Allowing us to view the contents of the encrypted drive. Within the drive we have a folder containing encrypted logs and the source code to the command and control server. 


![[Pasted image 20240813145501.png]]

Investigating the `AgentServer.cs` file shows us that this is the source code to the command and control server. Within this source code we see the encryption method used, along with the encryption key and IV.


![[encryption.png]]

The form of encryption is through DES into base64 with the following key and IV:
```
key = "AKaPdSgV"
iv = "QeThWmYq"
```

----
We can decrypt the logs using CyberChef finally giving us the flag:
![[decrypted.png]]