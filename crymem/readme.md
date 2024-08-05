# Crymem Write Up
## Files Provided
##### **aes_sample.c**
This file is an encryption script. From analyzing it, what I can conclude is that it takes the file holding the flag > reads it > loads the contents into memory > deletes the contents > uses an encryption key, and IV >  encrypts the contents > then prints the encrypted data and the IV 

##### **memdump.raw** 
This is a capture of the memory where the flag was loaded. However, after trying to load it into volatility, it seems we cannot work with it. 
Loading it into [Volatility](https://github.com/volatilityfoundation/volatility) and [FTK Imager](https://www.exterro.com/digital-forensics-software/ftk-imager) shows strings are stored within it.


### Getting Key information 
----
Extracting the strings using  `strings memdump.raw > stringoutput.txt`
will show a plethora of strings that we can look through.

Returning to the `aes_sample.c` file, we can look for both the file containing the flag and the IV used to encrypt the flag.

We are looking for **IVVALUE** and **ENCFLAG**, as we know they were printed out by the encryption script


![Pasted image 20240804181508.png](https://github.com/Dunbird/CTF-Writeups/blob/main/crymem/Pasted%20image%2020240804181508.png)


Providing us with:


**IVVALUE**: `0ac516e1bc21a36e68932e05ff8aa480`


**ENCFLAG**: `caed872aab2b3427778413df7ffa0cb769db2ef567ddc815a3e43a2a0b69b0899a504b198720197c93b897f45313d469`

However, we are missing the most important part of decrypting the flag: the key!


### Getting the key 
----
The most logical first step is to use a tool to extract files from the `memdump.raw` file. However, as previously noted, Volatility will not work; thus, we cannot dump the files. 

So we have to use tools such as [**Binwalk**](https://github.com/ReFirmLabs/binwalk), [**Foremost**](https://github.com/gerryamurphy/Foremost) or [**Bulk Extractor**](https://github.com/simsong/bulk_extractor) to dump the files.

###### Binwalker
Using binwalker did not give me any useful file to find the key


![Pasted image 20240804185247.png](https://github.com/Dunbird/CTF-Writeups/blob/main/crymem/Pasted%20image%2020240804185247.png)

###### Bulk Extractor
Running `bulk_extractor -o Desktop/crewCTF/crymem/dist/bulkextractor Desktop/crewCTF/crymem/dist/memdump.raw` provided me with many files.


![Pasted image 20240804185631.png](https://github.com/Dunbird/CTF-Writeups/blob/main/crymem/Pasted%20image%2020240804185631.png)

Amongst those files, we find our **aes_keys.txt** file!


![Pasted image 20240804185759.png](https://github.com/Dunbird/CTF-Writeups/blob/main/crymem/Pasted%20image%2020240804185759.png)

----
Now, we have everything we need to use a service such as Cyberchef to decrypt the flag.
**Key:** `11f9f5aafad8e57c0d14b2e1b52d83d6`


**IV:** `0ac516e1bc21a36e68932e05ff8aa480` 


**Encrypted Flag:** `caed872aab2b3427778413df7ffa0cb769db2ef567ddc815a3e43a2a0b69b0899a504b198720197c93b897f45313d469`


**Decrypted Flag**: `crew{M3m0ry_f0r3N_is_mysterious_@_crypt0_Challs}`


![Pasted image 20240804190140.png](https://github.com/Dunbird/CTF-Writeups/blob/main/crymem/Pasted%20image%2020240804190140.png)

