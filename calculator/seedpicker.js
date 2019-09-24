let bip32 = require('bip32')
let bip39 = require('bip39')


function submitButtonAction() {
    var suppliedSeedPhrase = document.getElementById('seedphrase_ta').value

    var wordCount = 0
    if (suppliedSeedPhrase.trim().length > 0) {
        wordCount = suppliedSeedPhrase.trim().split(" ").length
    }
    if (wordCount != 11 && wordCount != 23) {
        alert("Please enter 11 or 23 words. (You entered " + wordCount + ")")
    } else {

        let lastword = calculateLastWord(suppliedSeedPhrase);
        let derivationPath = "m/48'/1'/0'/2'"
        let mnemonic = suppliedSeedPhrase + " " + lastword
        let xpub = xpubFromMnemonic(mnemonic, derivationPath).xpub

        let result = {
            lastword: lastword,
            mnemonic: mnemonic,
            derivationPath, derivationPath,
            xpub: xpub,
        }


        document.getElementById("result1").innerText = result.lastword
        document.getElementById("result2").innerText = result.mnemonic
        document.getElementById("result3").innerText = result.xpub
        document.getElementById("result4").innerText = result.derivationPath
        document.getElementById("results").style.display = "inline"
    }
}

function calculateLastWord(suppliedSeedPhrase) {
    for (var index = 1; index <= 2048; index++) {
        var current = bip39.wordlists.EN[index - 1]
        var candidate = suppliedSeedPhrase.trim() + " " + current
        try {
            bip39.mnemonicToEntropy(candidate)
            //TODO Find all matching words and randomize
            return current
        } catch {
            //do nothing
        }
    }
}

function xpubFromMnemonic(mnemonic, derivationPath) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);
    const child = node.derivePath(derivationPath)
    const xpub = child.neutered().toBase58();
    return {
        xpub:xpub,
        zpub:'todo',
    }
}

module.exports.submitButtonAction = submitButtonAction
module.exports.calculate2 = calculateLastWord
module.exports.xpubFromMnemonic = xpubFromMnemonic