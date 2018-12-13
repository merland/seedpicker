## The Seedpicker guide for creating your own seed phrase

_This guide aims to educate the reader in a learning-by-doing fashion. However, it does not make any guarantees or promises, and does not take any responsibility for what anyone does with this material._

### What you need
* A PC or laptop capable of running Ubuntu. Almost any old computer will do. A hard drive is NOT needed.
* A CD or a USB Stick prepared with Ubuntu Live. CD is recommended (usually easier for newbies, and completely read-only). If you haven’t created one of those before, the following tutorial is a good starting point: bit.ly/2QD8mjC
* A printout of [the raffle ticket cutouts](SeedPicker_Ticket_Cutouts.pdf).  
* A printout of [the seed form](SeedPicker_Seed_Form.pdf).
* A printout of [the lookup table](SeedPicker_Lookup_Table.pdf). (Not absolutely necessary to print, but recommended)
* A printout of this guide. (Not absolutely necessary but recommended)
* A pair of scissors.
* A single 6-sided die. 🎲
* A small bag or box to put the raffle tickets in. An ordinary plastic bag works fine. 

### Part 1: Generation of 23 random words
Human beings are really bad at randomness! When randomness is important, you should never rely on something that comes from your brain! 
Modern computers are slowly getting better at randomness, but it is still difficult to make computerized randomness transparent. 
In other words, it is hard to convince humans that a random number has been created in a truly random fashion. 
This is the reason most public lotteries use physical and transparent lotto machines instead of using computerized randomness; 
It is crucial to convince the audience that the randomness is real and not manipulated in any way.

This guide uses a combination of raffle tickets and a six-sided playing die to create very good natural and transparent randomness. 

This is how you do it: 
Use the scissors to cut out the 342 raffle tickets and put them in the bag (or box). Make sure you don’t lose any of them. 
Mix them around thoroughly!
Use the Seed form, the raffle tickets, and the 6-sided die to draw the first 23 words. Read the instructions on the Seed Form carefully, and make sure to follow them all. 
You should now have a sheet of paper with 23 secret words, generated with a very high degree of randomness. Randomness that you yourself have witnessed and controlled. 
Don’t ever let anybody see what you have written on your Seed Form!   

### Part 2: Calculating the 24th word
The last word of a 24 word seed is a checkum word, calculated using the other 23 words. Unfortunately, we need to use a computer for this step. Since we need to enter our super secret 23 words into a computer, it must be a super secure computer! It must be offline and we must make sure all the secret data is completely discarded after shutdown. Follow the steps below to achieve this! 
Note that we don’t have to trust any of the software that downloaded here! No hacker can change the 23 words that we generated in the previous step. However, we do have to make sure that the secret information will not leak to the outside world, or to future users of the same computer.

#### 2a: Prepare hardware and software 
Open up the computer and remove the hard drive. This step is to convince you that Ubuntu Live will not save anything to the hard drive. If you feel certain that this will not happen, you can skip this step.  
Remove any removable media from the computer.
Boot up Ubuntu and run it in Live mode ("Try Ubuntu before installing").
Make sure you have a working Internet connection, wired or wireless (Click the small triangle on the top right of your screen).
Open Terminal (Press the Windows key and start typing “terminal”, then click the Terminal icon)
Our first commands will install the python dependency manager pip3.
sudo apt-get update ⮐
sudo apt-get install python3-pip ⮐  Answer Y at the prompt
(This may take a few minutes)


Then we use pip3 to install the library mnemonic (A utility library written by Trezor):

```pip3 install mnemonic``` ⮐


Using the command ```wget```, download the SeedPicker python script called lastword.py. It utilizes the *mnemonic* library to calculate the last word.   

```wget http://seedpicker.net/lastword.py```  ⮐ 

(That’s the capital letter O after wget, not a zero)

#### 2b: Disable all communication
We now have prepared the hardware and installed all required software. The next step is to go completely offline:  
* Pull any network cable.
* Disable all wireless communication (e.g. by enabling airplane mode).
* Make absolutely sure you are now offline, and from now on: Don't go online again until after you have restarted the computer!!
* Make sure nobody else can see your screen!
* Make sure nobody else can see your keyboard!
* Make sure nobody else can see your Seed Form!

#### 2c: Run the script 
In the same terminal window as earlier, type python3 lastword.py followed by all your 23 secret words (space separated): 
python3 lastword.py word1 word2 word3 word4 … word23  

When the script has calculated your 24th word, use your pen to type the word into the designated cell of the Seed Form. 

Shut down the computer as soon as possible. 

You have now generated a valid BIP39 seed phrase and the only record of it is the Seed Form. Keep it really secret. You may want to make copies and put in different locations. 

This guide does not cover how to store your seed phrase securely, so do your research well. 

If you intend to use the seed phrase with a hardware wallet, it is recommended to use the passphrase feature (sometimes called the 25th word) and keep the two phrases separated.   



### Comments or suggestions?
Visit *github.com/merland/seedpicker* or send an email to *seedpicker@megabit.se* 

Thanks!

  
