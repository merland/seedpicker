SeedPicker FAQ
==============

Why should I create my own seed phrase? My hardware wallet already does this for me!
------------------------------------------------------------------------------------
Hardware wallets have done an amazing job of boosting both security and user-friendliness in the crypto space. 
The major manufacturers keep developing innovative products and they all seem to be trustworthy enough. 

There is nothing that suggests that reputable hardware wallet manufacturers would “take a saw to the branch they are sitting on” and introduce malicious code into the seed creation algorithm. However, there have been incidents of so called “supply chain attacks”, where packages containing hardware wallets have been intercepted and hackers have been able to reprogram the hardware wallet. This kind of attack can - in theory - happen during every step of the supply chain. From the moment the wallet is manufactured to the moment you have it in your hand. 

By creating your own seed phrase, you can be 100% certain that the seed creation algorithm was not manipulated by a hacker. As a result, you are completely safe from supply-chain attacks. 

The risk of becoming a victim of a supply chain attack is probably very low, but it is definitely higher than zero. 
For wallets that will protect high values or highly sensitive information, the added security may be worth the extra work.


Why is the seed (phrase) so important?
--------------------------------------
Many types of cryptography depend on a very good source (“seed”) of randomness, and the same goes for the cryptography 
algorithms used to create bitcoin addresses. No matter how good the encryption algorithm is, it can be cracked if the 
cryptographic seed is not random enough. And it gets worse: If a hacker somehow does succeed to introduce a “bad” seed,
(created with a lower degree of randomness) there is no way for you to find out! 
Until all your coins are suddenly stolen, that is... The reason being that it is impossible to look at a number and determine if it was created using a lot of randomness, a little randomness, or maybe none at all. 
If you pick your own seed using SeedPicker, you take active part in the process and can see for yourself that the randomness produced is very high.


Is the SeedPicker last word calculator secure?
----------------------------------------------
The last word calculator is a simple web page containg some simple javascript logic. It is trivial to audit it to see what it does. However, an audit is really not needed! The script has no possibility to change the 23 words that you have drawn and noted on paper in the previous step, so it cannot do any harm. It could at worst give you an invalid last word. 
If there was an error in the calculation, you would notice this the first time you attempted to use the generated seed phrase, since wallets always validate seed phrases before use. 
The calculator is run in offline mode only, without storage, and the computer is shut down immediately afterwards. This makes sure your seed words will not leak outside the secured computer.  

You can just use some dice rolls and then convert the result to a seed. Why should I use the SeedPicker method instead?
-----------------------------------------------------------------------------------------------------------------------
There are several good online calculators that allow you to roll some dice and then convert the result into to a mnemonic seed. The best one is probably [Ian Coleman's Mnemonic Code Converter](https://iancoleman.io/bip39). This is a perfectly good way to generate a mnemonic (if you use it on a secure, offline machine!). In fact, this is the process described in the [BIP39 proposal](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#generating-the-mnemonic). 

This, however, has the problem of being transparent only to programmers. Somebody who knows little or nothing about programming has to trust that the conversion program is not compromised. SeedPicker solves this problem by letting the user pick (randomly of course) the actual words that will be used in the final seed. 

The only needed calculation is the checksum calculation. It is of no use to a potential hacker, so it does not matter that only programmers can check the validity/authenticity of it.  

There already is recommended way of addressing the issue of a compromised seed generation algorithm, which is to use a user-controlled passphrase. Why should I create my own seed if I use a passphrase? ([from this reddit thread](https://www.reddit.com/r/Bitcoin/comments/aei1qr/seedpicker_here_to_help_you_create_your_own_seed/))
-----------------------------------------------------
If you use a passhrase (sometimes called the 25th word) with your hardware wallet, you do get better protection against a compromised device. However, adding an extra layer of security does not mean you should neglect the original security. You need to make a tradeoff between security and convenience. The more you can trust your seed, the shorter you can make your passphrase. Longer passhrase gives better security but less convenience.
Also, a passphrase usually has to be typed into the computer, on a keyboard that may have a keylogger.




