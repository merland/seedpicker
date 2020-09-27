# SeedPicker [![Build Status](https://travis-ci.com/merland/seedpicker.svg?branch=master)](https://travis-ci.com/merland/seedpicker)

# [Looking for the SeedPicker Last Word calculator? Click here!](https://seedpicker.net/calculator/last-word.html)

SeedPicker wants to help you create good and safe private keys for your crypto wallets. The method has been designed to be easy to perform and understand for anyone. An even more important goal has been transparency; After having used SeedPicker you should be able to say the following with confidence:

- _I have understood every step of the process._
- _Nobody has had a chance to take part of my private key._
- _Nobody has had a chance to influence how my private key was created._

SeedPicker consist of the following two parts:

- The step-by-step [guide](guide/GUIDE.md) (Includes a few pdf documents that must be printed on paper)
- The [last word calculator](calculator/last-word.html).

Please also read through this intro and the [FAQ](FAQ.md).

### The guide

The guide helps you generate your own private key, in the form of a [seed phrase](https://en.bitcoin.it/wiki/Seed_phrase). This phrase looks like a weird sentence of 24 words. The first 23 words must be randomly selected out of a predefined word list. We follow the most popular standard, [BIP39](https://en.bitcoin.it/wiki/BIP_0039), which is supported by most wallets and currencies. The method for randomly copying words from the list to create your random sentence is explained in a transparent and understandable way. The final 24th word is calculated using a safe machine you must have or create.

### Source of randomness

The needed randomness must be sourced in a safe, private and understandable way. To minimize risks, we use these common physical objects; paper slips (like raffle tickets) that you can prepare yourself, and one 6-sided die. By using physical objects, the user can be fairly sure that nobody else can influence the randomness.

### The SeedPicker last word calculator

Following the BIP39 standard, the last (24th) word of the seed phrase must be calculated from the first 23 words.
The **SeedPicker last word calculator** does this for you. It is a javascript powered web form that you download to the secure computer. Please read all instructions and make sure you use a secure environment and machine before you perform the calculation. If you take shortcuts here, you risk getting your keys or even coins irreversibly stolen.

### Obligatory

_This guide aims to educate the reader in a learning-by-doing fashion. However, it does not make any guarantees or promises, and does not take any responsibility for what anyone does with this material._

_It is possible to use this guide to pick a seed phrase that may be "clever" or easy to remember in some way. NEVER DO THIS! If you do, there is a high risk that you lose your coins or your sensitive information. Private keys must be generated with a very high degree of randomness in order to be safe._

## References

- [This Reddit thread](https://www.reddit.com/r/crypto/comments/684zvj/need_help_generating_lastword_checksum_for_bip39/), which was the starting point for the idea to create this project.
- [The official BIP39 specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) The standard for wallet phrases.
- [dice2mnemonic](https://github.com/mohrt/dice2mnemonic) a Python program that converts dice rolls to a seed phrase.
- https://iancoleman.io/bip39/ An excellent mnemonic code converter, only it doesn't calculate the 24th word.
