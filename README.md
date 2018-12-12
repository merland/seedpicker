# SeedPicker

SeedPicker is a package consisting of a [step-by-step guide](seedpicker.pdf), and a small script. 
The SeedPicker guide helps you generate your own 24 word BIP39 seed phrase, with transparent randomness and a trustless computer environment. 

By creating randomness from physical objects (raffle tickets and one 6-sided die), the user can convince himself/herself that no hacker can influence the randomness or the resulting seed. 
The accompanying script calculates the 24th word of the seed, and the instructions make sure the script is run in a completely secure environment.

_This guide aims to educate the reader about security practices in a learning-by-doing fashion. However, it does not make any guarantees or promises, and obviously cannot take any responsibilities whatsoever regarding how the reader chooses to use it._

References:
* [The official BIP39 specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) 
* [dice2mnemonic](https://github.com/mohrt/dice2mnemonic) (Python code to convert dice rolls to a seed phrase) 
* (https://iancoleman.io/bip39/) Probably the best mnemonic code converter (however, it does not calculate the 24th word). 
* [This reddit thread](https://www.reddit.com/r/crypto/comments/684zvj/need_help_generating_lastword_checksum_for_bip39/), which was the starting point for the idea to create this repo. 
