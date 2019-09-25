let bip32 = require('bip32')
let bip39 = require('bip39')


function submitButtonAction() {
    const suppliedSeedPhrase = document.getElementById('seedphrase_ta').value

    let wordCount = 0
    if (suppliedSeedPhrase.trim().length > 0) {
        wordCount = suppliedSeedPhrase.trim().split(" ").length
    }
    if (wordCount !== 11 && wordCount !== 23) {
        alert("Please enter 11 or 23 words. (You entered " + wordCount + ")")
    } else {
        const lastword = randomLastWord(suppliedSeedPhrase)
        let derivationPath = {
            path: "m/48'/1'/0'/2'",
            description: 'Suitable for Electrum multisig',
        }
        let mnemonic = suppliedSeedPhrase + " " + lastword
        let xpub = xpubFromMnemonic(mnemonic, derivationPath.path).xpub

        let result = {
            lastword: lastword,
            mnemonic: mnemonic,
            derivationPath: derivationPath,
            xpub: xpub,
        }

        document.getElementById("result1").innerText = result.lastword
        document.getElementById("result2").innerText = result.mnemonic
        document.getElementById("result3").innerText = result.xpub
        document.getElementById("result4").innerText = result.derivationPath.path + ' (' + result.derivationPath.description + ')'
        document.getElementById("results").style.display = "inline"
    }
}

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))]
}

function randomLastWord(suppliedSeedPhrase) {
    return allLastWords(suppliedSeedPhrase).random()
}

function allLastWords(suppliedSeedPhrase) {
    return [...Array(2048).keys()]
        .map(wordOrBlank(suppliedSeedPhrase))
        .filter(word => word.length > 0)
}

function wordOrBlank(suppliedSeedPhrase) {
    return i => {
        const current   = bip39.wordlists.EN[i]
        const candidate = suppliedSeedPhrase.trim() + " " + current
        try {
            bip39.mnemonicToEntropy(candidate)
            return current
        } catch {
            return ""
        }
    };
}

function xpubFromMnemonic(mnemonic, derivationPath) {
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const node = bip32.fromSeed(seed)
    const child = node.derivePath(derivationPath)
    const xpub = child.neutered().toBase58()
    return {
        xpub: xpub,
        zpub: 'todo'
    }
}

module.exports.submitButtonAction = submitButtonAction
module.exports.randomLastWord = randomLastWord
module.exports.allLastWords = allLastWords
module.exports.xpubFromMnemonic = xpubFromMnemonic
