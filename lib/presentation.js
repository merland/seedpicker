/**
 * Presentation logic that does not need unit testing
 */
const kjua = require('kjua');

const bip39 = require('bip39')
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
        const $hero = $('.hero');
        $hero.removeClass('is-info');
        $hero.addClass('is-danger');
    }
    $('.page_heading').text(actualTitle)
    $('head title').text(actualTitle)

    const $seedphraseInput = $('#seedphrase_input');
    $seedphraseInput.focus()
    $seedphraseInput.keypress(enterIsSubmit);

    const $toggleAdvancedBtn = $('#toggle_advanced_btn');
    $toggleAdvancedBtn.text(showMoreText)
    $toggleAdvancedBtn.on('click', toggleAdvanced)

    $('#seed-submit').on('click', submitButtonAction)
    $('#sample_phrase').on('click', generateSample)
    $('#qr_code_button').on('click', showQR)
    $('.modal-close').on('click', hideQR)
    $('.modal-background').on('click', hideQR)
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
    const $advanced = $("#advanced")
    if ($advanced.hasClass('is-hidden')) {
        $advanced.removeClass('is-hidden');
    } else {
        $advanced.addClass('is-hidden');
    }
};

const isTestnet = () => network === TESTNET;
const isMainnet = () => network === MAINNET;

function otherNetwork() {
    if (isMainnet()) {
        return TESTNET;
    } else if (isTestnet()) {
        return MAINNET;
    }
    throw new Error(`Wrong network: [${network}]`)
}

function submitButtonAction() {
    const phraseField = $("#seedphrase_input");
    const validation = logic.validate(phraseField.val())
    const $seedErrorMsg = $("#seed_error_msg");
    $("#results").addClass('is-hidden');
    $("#advanced").addClass('is-hidden');
    clearResults()
    if (!validation.valid) {
        $seedErrorMsg.text(validation.errorMessage)
        $seedErrorMsg.removeClass('is-hidden');
        return
    }
    $seedErrorMsg.addClass('is-hidden');
    phraseField.text(validation.cleanedUpPhrase)

    const $seedButton = $("#seed-submit");
    $seedButton.addClass("is-loading")

    setTimeout(() => {
        const lastword = logic.firstFoundLastWord(validation.cleanedUpPhrase)
        const mnemonic = phraseField.val() + " " + lastword

        const pubKeys = logic.keysFromMnemonic(mnemonic, network);

        $("#checksum_word").text(lastword)
        $("#complete_phrase").text(mnemonic.toLowerCase())
        $("#network").text(network)

        $("#networkswitchlink").html(`&nbsp;<a href="?network=${otherNetwork()}">(switch to ${otherNetwork()})</a>`);
        $("#xpub_key").text(pubKeys.xpub)

        if (isTestnet()) {
            $("#extended_pub_heading").text(getVersionBytes("Vpub").desc)
            $("#extended_pub_result").text(pubKeys.Vpub)
        } else {
            $("#extended_pub_heading").text(getVersionBytes("Zpub").desc)
            $("#extended_pub_result").text(pubKeys.Zpub)
        }
        $("#result12").text(pubKeys.Vpub)
        $("#derivation_path").text(pubKeys.derivationPath)
        $("#results").removeClass('is-hidden');
        $seedButton.removeClass("is-loading")
    }, 50)
}

function clearResults() {
    $("#checksum_word").text("")
    $("#complete_phrase").text("")
    $("#network").text("")

    $("#networkswitchlink").html(`&nbsp;<a href="?network=${otherNetwork()}">(switch to ${otherNetwork()})</a>`);
    $("#xpub_key").text("")

    $("#extended_pub_heading").text("")
    $("#extended_pub_result").text("")
    $("#result12").text("")
    $("#derivation_path").text("")
}
function generateSample() {
    const samplePhrase = [...Array(23).keys()]
        .map(() => bip39.wordlists.EN.random())
        .join(" ");
    $("#seedphrase_input").val(samplePhrase)
}

function showQR() {
    const zpub = $("#extended_pub_result").text();
    const qrOptions = {
        // render method: 'canvas' or 'image'
        render: 'canvas',

        // render pixel-perfect lines
        crisp: true,

        // error correction level: 'L', 'M', 'Q' or 'H'
        ecLevel: 'H',

        // size in pixel
        size: 200,

        // code color
        fill: '#333',

        // background color
        back: '#fff',

        // content
        text: zpub,

        // roundend corners in pc: 0..100
        rounded: 100,

        // quiet zone in modules
        quiet: 2,
    }
    const qr_canvas = kjua(qrOptions);
    $("#qr_code").append(qr_canvas)
    $("#qr_text").text(zpub)
    $('.modal').addClass('is-active')
}

const hideQR = () => {
    $('.modal').removeClass('is-active')
    $('#qr_code > canvas').remove()
    $('#qr_text').text('')
};

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))]
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
    init: init
}
