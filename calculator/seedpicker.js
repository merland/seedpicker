const bip32 = require('bip32')
const bip39 = require('bip39')
const b58 = require('bs58check');

const showMoreText = "Show more (for advanced users)"; //TODO duplicated in html
const showLessText = "Show less";

//See https://github.com/satoshilabs/slips/blob/master/slip-0132.md
const versionBytes = {
    "xpub": "0488b21e",
    "ypub": "049d7cb2",
    "zpub": "04b24746",
    "Ypub": "0295b43f",
    "Zpub": "02aa7ed3",
    "tpub": "043587cf",
    "upub": "044a5262",
    "Upub": "024289ef",
    "vpub": "045f1cf6",
    "Vpub": "02575483"
}

function initShowMore() {
    let btn = document.getElementById("moreorless_btn");
    if (btn.innerText === '') btn.innerText = showMoreText
}

function submitButtonAction() {
    const suppliedSeedPhrase = document.getElementById('seedphrase_ta').value

    const validation = validate(suppliedSeedPhrase)
    if (!validation.valid) {
        alert(validation.errorMessage)
        return
    }

    const lastword = randomLastWord(suppliedSeedPhrase)
    const mnemonic = suppliedSeedPhrase + " " + lastword

    const mainNetDerivationPath = "m/48'/0'/0'/2'"
    const mainNetPubKeys = keysfromMnemonic(mnemonic, mainNetDerivationPath);

    const testNetDerivationPath = "m/48'/1'/0'/2'"
    const testNetPubKeys = keysfromMnemonic(mnemonic, testNetDerivationPath);

    document.getElementById("result1").innerText = lastword
    document.getElementById("result2").innerText = mnemonic.toLowerCase()
    document.getElementById("result4").innerText = mainNetPubKeys.Zpub

    document.getElementById("result3").innerText = mainNetPubKeys.xpub
    document.getElementById("result5").innerText = mainNetDerivationPath

    document.getElementById("result11").innerText = testNetPubKeys.xpub
    document.getElementById("result12").innerText = testNetPubKeys.Vpub

    document.getElementById("results").style.display = "inline"
}

function validate(suppliedSeedPhrase) {
    let wordCount = 0
    const trimmedWords = suppliedSeedPhrase
        .trim()
        .split(" ")
        .filter(word => word.length > 0)
        .map(word => word.trim())

    if (trimmedWords.length > 0) {
        wordCount = trimmedWords.length
    }
    if (wordCount !== 11 && wordCount !== 23) {
        const msg = "Please enter 11 or 23 words. (You entered " + wordCount + ")"
        return validationReply(msg)
    }
    const dictionary = bip39.wordlists[bip39.getDefaultWordlist()]
    const nonDictionaryWords = trimmedWords
        .map(word => dictionary.includes(word) ? "" : word)
        .filter(word => word.length > 0)
        .join(" ")
    if (nonDictionaryWords.length > 0) {
        const msg = "Words not in dictionary: " + nonDictionaryWords
        return validationReply(msg)
    }
    return validationReply("")
}

function validationReply(errorMsg) {
    return {
        valid: errorMsg === "",
        errorMessage: errorMsg
    }
}

function moreorless() {
    const button = document.getElementById('moreorless_btn')
    const results2 = document.getElementById('results2')

    console.log('results2.style.display:' + results2.style.display)
    if (!results2.style.display || results2.style.display === 'none') {
        results2.style.display = 'inline';
        button.innerHTML = showLessText;
    } else {
        button.innerHTML = showMoreText;
        results2.style.display = 'none';
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
        const current = bip39.wordlists.EN[i]
        const candidate = suppliedSeedPhrase.trim().toLowerCase() + " " + current
        try {
            bip39.mnemonicToEntropy(candidate)
            return current
        } catch {
            return ""
        }
    };
}

function getVersionBytes(prefix) {
    return versionBytes[prefix];
}

function keysfromMnemonic(mnemonic, derivationPath) {
    return {
        xpub: xpubFrom(mnemonic, derivationPath),
        Zpub: anyPubFrom(xpubFrom(mnemonic, derivationPath), 'Zpub'),
        Vpub: anyPubFrom(xpubFrom(mnemonic, derivationPath), 'Vpub'),
    }
}

function xpubFrom(mnemonic, derivationPath) {
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const node = bip32.fromSeed(seed)
    const child = node.derivePath(derivationPath)
    return child.neutered().toBase58()
}

/**
 * Convert from xpub to other formats
 */
function anyPubFrom(xpub, prefix) {
    let versionBytes = Buffer.from(getVersionBytes(prefix), "hex")
    try {
        let data = b58.decode(xpub.trim());
        data = data.slice(4);
        data = Buffer.concat([versionBytes, data]);
        return b58.encode(data);
    } catch (err) {
        return "Invalid extended public key";
    }
}

module.exports.submitButtonAction = submitButtonAction
module.exports.randomLastWord = randomLastWord
module.exports.allLastWords = allLastWords
module.exports.xpubFromMnemonic = keysfromMnemonic
module.exports.moreorless = moreorless
module.exports.initShowMore = initShowMore
module.exports.validate = validate
