## The Seedpicker guide for creating your own seed phrase

_This guide aims to educate the reader in a learning-by-doing fashion. However, it does not make any guarantees or promises, and does not take any responsibility for what anyone does with this material._

### What you need
* A PC or laptop capable of running Ubuntu. Almost any old computer will do. A hard drive is NOT needed.
* A CD or a USB Stick prepared with Ubuntu Live. CD is recommended (usually easier for newbies, and completely read-only). If you haven’t created one of those before, the following tutorial is a good starting point: **bit.ly/2QD8mjC**
* A printout of **[the raffle ticket cutouts](SeedPicker_Ticket_Cutouts.pdf)**.  
* A printout of **[the seed form](SeedPicker_Seed_Form.pdf)**.
* A printout of **[the lookup table](SeedPicker_Lookup_Table.pdf)**. 
(Can also be read from the screen, but a printout is recommended)
* A printout of this guide. (Can also be read from the screen, but a printout is recommended)
* A pair of scissors. ✄
* A single 6-sided die. 🎲
* A small bag or box to put the raffle tickets in. An ordinary plastic bag works fine. 

### Part 1: Generation of 23 random words
Human beings are really bad at randomness! When randomness is important, you should never rely on something that comes from your brain! 
Modern computers are slowly getting better at randomness, but it is still difficult to make computerized randomness in a way that is transparent to human beings. 
In other words, it is hard to convince humans that a random number has been created in a truly random fashion. 
This is the reason most public lotteries use physical and transparent lotto machines instead of using computerized randomness; 
It is crucial to convince the audience that the randomness is real and not manipulated in any way.

This guide uses a combination of raffle tickets and a six-sided playing die to create very good natural and transparent randomness. 

This is how you do it: 

* Use the scissors to cut out the 342 raffle tickets and put them in the bag (or box). Make sure you don’t lose any of them. Mix them around thoroughly!
* Use the seed form, the raffle tickets, and the 6-sided die to pick the first 23 words. Read the instructions on the Seed Form carefully, and make sure to follow them all. 

You should now have a sheet of paper with 23 secret words, generated with a very high degree of randomness. Randomness that you yourself have witnessed and controlled. 
Don’t ever let anybody see what you have written on your Seed Form!   

### Part 2: Calculating the 24th word
The last word of a 24 word seed is a checksum word, calculated using the other 23 words as input. Unfortunately, we need to use a computer for this step. Since we need to enter our super secret 23 words into a computer, it must be a super secure computer! It must be offline and we must make sure all the secret data is completely discarded after shutdown. Follow the steps below to achieve this! 


#### 2a: Prepare hardware and software 
* Open up the computer and remove the hard drive. This step is to convince you that Ubuntu Live will not save anything to the hard drive. If you feel certain that this will not happen, you can skip this step.  
* Remove any removable media from the computer.
* Boot up Ubuntu and run it in Live mode ("Try Ubuntu before installing").
* Make sure you have a working Internet connection, wired or wireless (Click the small triangle on the top right of the Ubuntu desktop).
* Open Firefox and type in the following address: 

```seedpicker.net/calculator/last-word.html```

This is the **SeedPicker last word calculator**. Let the page load but **DO NOT ENTER ANYTHING IN THE FORM AT THIS POINT!**

*Tip for advanced users: Open a second tab and navigate to ```iancoleman.io/bip39```, but **DO NOT ENTER ANYTHING AT THIS POINT!** 
Having this page pre-loaded will later enable you to double-check the validity of the generated seed phrase, right before you shut down the computer.*

Note that the code on the web page(s) downloaded in the previous step _does not need to be trusted_! The 23 words that we generated in the previous step cannot be changed by any software. However, we do have to make sure that the secret information will not leak to the outside world, or to future users of the same computer._


#### 2b: Disable all communication
The secure computer is now fully configured and the next step is to go **completely offline**:  

* Pull any network cable.
* Disable all wireless communication (e.g. by enabling airplane mode).
* Make absolutely sure you are now offline, and from now on: Don't go online again until after you have restarted the computer!!
* Make sure nobody else can see your screen!
* Make sure nobody else can see your keyboard!
* Make sure nobody else can see your Seedpicker Seed Form!

#### 2c: Perform the calculation 

Go back to FireFox and the **SeedPicker last word calculator**. Following the instructions on the page, enter your 23 words into the field and press the button.

Use your pen to type the resulting 24th word into the designated cell of the Seed Form. 

**Shut down the computer as soon as possible.**  

You have now generated a valid BIP39 seed phrase and the only existing record of it is the Seed Form. Keep it really secret. You may want to make copies and put in different locations. If you make copies, do it manually. Don't use a copier, camera or any form of computer.  

This guide does not cover how to store your seed phrase securely, so do your research well. 

If you intend to use the seed phrase with a hardware wallet, it is recommended to use the *passphrase* feature (sometimes called the 25th word) and keep the two phrases separated.   


### Comments or suggestions?
Visit *github.com/merland/seedpicker* or send an email to *seedpicker@megabit.se* 

Thanks!

  
