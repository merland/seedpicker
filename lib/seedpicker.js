const bip32 = require('bip32')
const bip39 = require('bip39')
const b58 = require('bs58check')
const xpubformats = require('./xpubformats.js')
const logic = require('./logic.js')

const title = "SeedPicker: Last Word and XPUB Calculator";

const showMoreText = "Show more (for advanced users)";
const showLessText = "Show less";

const MAINNET = "mainnet"
const TESTNET = "testnet"

let network = MAINNET;

function init() {
    setNetworkFromUrlParams()
    let actualTitle = title
    if (isTestnet()) {
        actualTitle = title + " - TESTNET"
        $('button').css('background', 'orange');
    }
    $('#page_heading').text(actualTitle)
    $('head title').text(actualTitle)

    const $seedphraseTa = $('#seedphrase_input');
    $seedphraseTa.focus()
    $seedphraseTa.keypress(enterIsSubmit);

    const $moreorlessBtn = $('#toggle_advanced_btn');
    $moreorlessBtn.text(showMoreText)
    $moreorlessBtn.click(toggleAdvanced)

    $('#seed-submit').click(submitButtonAction)
    $('#sample_phrase').click(generateSample)


}

const enterIsSubmit = event => {
    if (event.which === 13) {
        $('#seed-submit').click();
        return false;
    }
};

const toggleAdvanced = () => {
    const $moreorlessBtn = $('#toggle_advanced_btn');
    $moreorlessBtn.text($moreorlessBtn.text() === showMoreText ? showLessText : showMoreText)
    $('#advanced').toggle()
};

const isTestnet = () => network === TESTNET;

const isMainnet = () => network === MAINNET;

function otherNetwork() {
    if (isMainnet()) {
        return TESTNET;
    } else if (isTestnet()){
        return MAINNET;
    }
    throw new Error(`Wrong network: [${network}]`)
}

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

    const pubKeys = logic.keysFromMnemonic(mnemonic, network);

    $("#checksum_word").text(lastword)
    $("#complete_phrase").text(mnemonic.toLowerCase())
    $("#network").text(network)

    $("#networkswitchlink").html(`&nbsp;<a href="?network=${otherNetwork()}">(switch to ${otherNetwork()})</a>`);
    $("#xpub_key").text(pubKeys.xpub)

    if (isTestnet()) {
        $("#extended_pub_heading").text( getVersionBytes("Vpub").desc)
        $("#extended_pub").text(pubKeys.Vpub)
    } else {
        $("#extended_pub_heading").text(getVersionBytes("Zpub").desc)
        $("#extended_pub").text(pubKeys.Zpub)
    }
    $("#result12").text(pubKeys.Vpub)
    $("#derivation_path").text(pubKeys.derivationPath)
    $("#results").css('display', 'inline')
}

function generateSample() {
    const samplePhrase = [...Array(23).keys()]
        .map(() => bip39.wordlists.EN.random())
        .join(" ");
    $("#seedphrase_input").val(samplePhrase)
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

function setNetworkFromUrlParams() {
    const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    if (vars.network && vars.network.toLowerCase() === TESTNET) network = TESTNET
}

function getVersionBytes(prefix) {
    return xpubformats.xpubPrefixes[prefix];
}
module.exports = {
    init: init,
    validate: validate,
    randomLastWord: randomLastWord,
    allLastWords: allLastWords,
    firstFoundLastWord: firstFoundLastWord,
}
