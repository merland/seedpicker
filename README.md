# SeedPicker

SeedPicker wants to help you create good and safe private keys for your crypto wallets.

The method is designed to be easy to perform and understand.

This collection of files includes a [step-by-step guide](GUIDE.md) and a web form calculator. It is recommended to also read the [FAQ](FAQ.md).

### The guide

The guide helps you generate your own **seed phrase**. This phrase looks like a weird sentence of 24 words. The first 23 words must be randomly copied out of a predefined word list. We follow the most popular standard, also called BIP39, which is supported by most wallets and currencies. The method for randomly copying words from the list to create your random sentence is explained in a transparent and understandable way. The final 24th word is calculated using a safe machine you must have or create.

### Source of randomness

The needed randomness must be sourced in a safe, private and understandable way. To minimize risks, we use these common physical objects; paper slips (like raffle tickets) that you can prepare yourself, and one 6-sided die. This is important so the user can be fairly sure that nobody can influence the randomness or learn or influence the resulting seed phrase.

### The SeedPicker last word calculator

Following the BIP39 standard, the last (24th) word of the sentence must be calculated from the first 23 words.
The included **SeedPicker last word calculator** does this for you. It is a javascript powered web form that you download to the secured computer. Please read all instructions and make sure you use a secure environment and machine before you perform the calculation. If you take shortcuts here, you risk getting your keys or even coins irreversibly stolen.
If you could do the calculation on paper, you instead risk creating an incorrect key.

### Obligatory

_This guide aims to educate the reader in a learning-by-doing fashion. However, it does not make any guarantees or promises, and does not take any responsibility for what anyone does with this material._

## References
* [This Reddit thread](https://www.reddit.com/r/crypto/comments/684zvj/need_help_generating_lastword_checksum_for_bip39/), which was the starting point for the idea to create this guide and script program.
* [The official BIP39 specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) The standard for wallet phrases.
* [dice2mnemonic](https://github.com/mohrt/dice2mnemonic) a Python program that converts dice rolls to a seed phrase. 
* https://iancoleman.io/bip39/ An excellent mnemonic code converter, only it doesn't calculate the 24th word. 

## Alternatives

Before creating this guide, we did try creating our secret keys in other ways:

- Fully computer generated. Risks: bad sources of randomness, programming mistakes in big programs, hacking.
- Fully manully generated. Risks: Takes hours, and mistakes are hard to spot and avoid.
- Rolling a 6 sided die 99 times, the using a program similar to ours. Or rolling a specially made die with many more sides, then using a program similar to ours. Risks: mistakes/laziness when entering the die roll results, problems from the program used, harer to understand and verify the correctness of the program.
- Rolling a 6 sided die a few times and entering that into a hardware wallet. Risks: loss/theft/hacking of the hardware wallet or its software.

### And nothing more

We know of no other method that is better, and we've been searching for a while. Anyway, you should always do your own research and due diligence too. And if you discover anything better+easier+safer than BIP39 with a raffle and a 6 sided die, or even just some small improvement to the guide or explanatory material (what you are now reading) please do tell us what we can improve.
