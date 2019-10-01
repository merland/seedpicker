const bip32 = require('bip32')
const bip39 = require('bip39')
const b58 = require('bs58check');

const showMoreText = "Show more (for advanced users)";
const showLessText = "Show less";

let network = "mainnet";

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

function init() {
    setNetworkFromUrlParams()
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
    $("#result4").text(pubKeys.Zpub)
    if (network == 'testnet') $("#result4").text('N/A') //FIXME remove presentation logic
    $("#result12").text(pubKeys.Vpub)
    if (network == 'mainnet') $("#result12").text('N/A') //FIXME remove presentation logic
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
        Zpub: anyPubFrom(xpubFrom(mnemonic, derivationPath), 'Zpub'),
        Vpub: anyPubFrom(xpubFrom(mnemonic, derivationPath), 'Vpub'),
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

function displayQR() {
    alert("Yo, baby!")
}

function setNetworkFromUrlParams() {
    const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
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