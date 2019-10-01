const bip32 = require('bip32')
const bip39 = require('bip39')
const b58 = require('bs58check');

const title = "SeedPicker: Last Word and XPUB Calculator";
const showMoreText = "Show more (for advanced users)";
const showLessText = "Show less";

let network = "mainnet";

//See https://github.com/satoshilabs/slips/blob/master/slip-0132.md
const versionBytes = {
    "xpub": {
        vb: "0488b21e",
    },
    "ypub": {
        vb: "049d7cb2"
    },
    "zpub": {
        vb: "04b24746"
    },
    "Ypub": {
        vb: "0295b43f"
    },
    "Zpub": {
        vb: "02aa7ed3",
        desc: "Extended Public Key in Zpub format, for Electrum's native segwit multisig (p2wsh)"
    },
    "tpub": {
        vb: "043587cf"
    },
    "upub": {
        vb: "044a5262"
    },
    "Upub": {
        vb: "024289ef"
    },
    "vpub": {
        vb: "045f1cf6"
    },
    "Vpub": {
        vb: "02575483",
        desc: "Extended Public Key in Vpub format (Testnet P2WSH)"
    }
}

function init() {
    setNetworkFromUrlParams()
    let actualTitle = title
    if (isTestnet()) actualTitle = title + " - TESTNET"
    $('#text1_heading').text(actualTitle)
    $('head title').text(actualTitle)

    const $seedphraseTa = $('#seedphrase_input');
    $seedphraseTa.focus()
    $seedphraseTa.keypress(enterIsSubmit);

    const $moreorlessBtn = $('#moreorless_btn');
    $moreorlessBtn.text(showMoreText)
    $moreorlessBtn.click(toggleAdvanced)

    $('#seed-submit').click(submitButtonAction)
    $('#zpub_qr_code_btn').click(displayQR)
}

const enterIsSubmit = event => {
    if (event.which === 13) {
        $('#seed-submit').click();
        return false;
    }
};

const toggleAdvanced = () => {
    const $moreorlessBtn = $('#moreorless_btn');
    $moreorlessBtn.text($moreorlessBtn.text() === showMoreText ? showLessText : showMoreText)
    $('#results2').toggle()
};

//temporary...
function translateUndefined(theVar) {
    if (!theVar) return "N/A"
    return theVar;
}

const isTestnet = () => network == 'testnet';

const isMainnet = () => !isTestnet();

function submitButtonAction() {
    const phraseField = $("#seedphrase_input");
    const validation = validate(phraseField.val())
    if (!validation.valid) {
        alert(validation.errorMessage)
        return
    }

    phraseField.text(validation.cleanedUpPhrase)
    const lastword = firstFoundLastWord(validation.cleanedUpPhrase)
    const mnemonic = phraseField.val() + " " + lastword

    const pubKeys = keysfromMnemonic(mnemonic, network);

    $("#result1").text(lastword)
    $("#result2").text(mnemonic.toLowerCase())
    $("#result13").text(network)
    $("#result3").text(pubKeys.xpub)

    if (isTestnet()) {
        $("#result4_heading").text(getVersionBytes("Vpub").desc)
        $("#result4").text(translateUndefined(pubKeys.Vpub))
    } else {
        $("#result4_heading").text(getVersionBytes("Zpub").desc)
        $("#result4").text(translateUndefined(pubKeys.Zpub))
    }
    $("#result12").text(translateUndefined(pubKeys.Vpub))
    $("#result5").text(pubKeys.derivationPath)
    $("#results").css('display', 'inline')
}

function validate(suppliedSeedPhrase) {
    let wordCount = 0
    const trimmedWords = suppliedSeedPhrase
        .trim()
        .split(" ")
        .filter(word => word.length > 0)
        .map(word => word.trim())
        .map(word => word.toLowerCase())

    if (trimmedWords.length > 0) {
        wordCount = trimmedWords.length
    }
    if (wordCount !== 23) {
        const msg = "Please enter 23 words. (You entered " + wordCount + ")"
        return validationReply(msg)
    }
    const dictionary = bip39.wordlists[bip39.getDefaultWordlist()]
    const nonDictionaryWords =
        trimmedWords
            .map(word => dictionary.includes(word) ? "" : word)
            .filter(word => word.length > 0)
            .map(word => "'" + word + "'")
            .join(", ")
    if (nonDictionaryWords.length > 0) {
        const msg = "Words not in dictionary: " + nonDictionaryWords
        return validationReply(msg)
    }
    return validationReply("", trimmedWords.join(" "))
}

function validationReply(errorMsg, words) {
    return {
        valid: errorMsg === "",
        errorMessage: errorMsg,
        cleanedUpPhrase: words
    }
}

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))]
}

// Currently not used by domain code, see GH issue #13
// TODO: Remove once we are sure it won't be used.
function randomLastWord(suppliedSeedPhrase) {
    return allLastWords(suppliedSeedPhrase).random()
}

function firstFoundLastWord(suppliedSeedPhrase) {
    return allLastWords(suppliedSeedPhrase)[0]
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

function derivationPathFromNetwork(network) {
    if (network == 'mainnet') return "m/48'/0'/0'/2'"
    if (network == 'testnet') return "m/48'/1'/0'/2'"
    throw new Error("Wrong network " + network)
}

function keysfromMnemonic(mnemonic, network) {
    const derivationPath = derivationPathFromNetwork(network)
    return {
        xpub: xpubFrom(mnemonic, derivationPath),
        Zpub: anyPubFrom(xpubFrom(mnemonic, derivationPath), 'Zpub', network),
        Vpub: anyPubFrom(xpubFrom(mnemonic, derivationPath), 'Vpub', network),
        derivationPath: derivationPath
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
function anyPubFrom(xpub, prefix, network) {
    if (!network) throw new Error("network not set")
    if (network == 'mainnet' && prefix == 'Vpub') return undefined
    if (network == 'testnet' && prefix == 'Zpub') return undefined
    let versionBytes = Buffer.from(getVersionBytes(prefix).vb, "hex")
    try {
        let data = b58.decode(xpub.trim());
        data = data.slice(4);
        data = Buffer.concat([versionBytes, data]);
        return b58.encode(data);
    } catch (err) {
        return "Invalid extended public key";
    }
}

function displayQR() {
    alert("Yo, baby!")
}

function setNetworkFromUrlParams() {
    const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    if (vars.network == 'testnet') network = 'testnet'
}

module.exports = {
    init: init,
    validate: validate,
    randomLastWord: randomLastWord,
    allLastWords: allLastWords,
    keysFromMnemonic: keysfromMnemonic,
    displayQE: displayQR,
    firstFoundLastWord: firstFoundLastWord,
}