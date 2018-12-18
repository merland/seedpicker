SeedPicker FAQ
==============

Why should I create my own seed phrase? My hardware wallet already does this for me!
------------------------------------------------------------------------------------
Hardware wallets have done an amazing job of boosting both security and user-friendliness in the crypto space. 
The major manufacturers do a great job of developing new hardware and features, and they all seem to be trustworthy enough. 
There is nothing that suggests that they would “take a saw to the branch they are sitting” on and introduce malicious code
into the seed creation algorithm.

However, there have been incidents of so called “supply chain attacks”, where packages containing hardware wallets have been
intercepted and hackers have been able to reprogram the hardware wallet. This kind of attack can - in theory - happen during 
every step of the supply chain. From the moment the wallet is manufactured to the moment you have it in your hand. By creating 
your own seed phrase, you can be certain that the seed creation algorithm was not manipulated by a hacker. As a result, you are 
completely safe from supply-chain attacks. 

The risk of becoming a victim of a supply chain attack is probably very low, but it is definitely higher than zero. 
For wallets that will protect high values or highly sensitive information, the added security may be worth the extra work.


Why is the seed (phrase) so important?
--------------------------------------
Many types of cryptography depend on a very good source (“seed”) of randomness, and the same goes for the cryptography 
algorithms used to create bitcoin addresses. No matter how good the encryption algorithm is, it can be cracked if the 
cryptographic seed is not random enough. And it gets worse: If a hacker somehow does succeed to introduce a “bad” seed,
(created with a lower degree of randomness) there is no way for you to find out! Until all your coins are suddenly stolen, 
that is... The reason is that it's impossible to look at a number and determine if it was created using a lot of randomness,
a little randomness, or maybe none at all.


Is the SeedPicker last word calculator secure?
----------------------------------------------
The last word calculator is a simple page containg some simple javacscript logic. This makes it trivial to audit it to see what it does. However, an audit is really not needed! The script has no possibility to change the 23 words that you have drawn in the previous step, so it cannot do any harm whatsoever.  
If there was an error in the calculation, you would notice it the first time you attempted to use the generated seed phrase, since wallets always validate seed phrases before use.
The calculator is run in offline mode only, and the computer is shut down immediately afterwards. This makes sure your words do not leak outside the secured computer.  

