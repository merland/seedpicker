/**
 * Presentation logic that does not need unit testing
 */
const kjua = require('kjua');

const bip39 = require('bip39')
const xpubformats = require('./xpubformats.js')
const logic = require('./logic.js')

const title = "SeedPicker";
const subtitle = "Construct your own Seed Phrase and calculate the Extended Public Key";
const showMoreText = "Show more (for advanced users)";
const showLessText = "Show less";

const MAINNET = "mainnet"
const TESTNET = "testnet"

let network = MAINNET;

function init() {
    setNetworkFromUrlParams()
    ga()
    let actualTitle = title
    if (isTestnet()) {
        actualTitle = title + " - TESTNET"
        $('#warning').hide()

        const $info_color = $('.is-info');
        $info_color.removeClass('is-info');
        $info_color.addClass('has-background-grey');
    }
    $('.page_heading').text(actualTitle)
    $('.page_subtitle').text(subtitle)
    $('head title').text(actualTitle)

    const $seedphraseInput = $('#seedphrase_input');
    $seedphraseInput.focus()
    $seedphraseInput.keypress(enterIsSubmit);

    hideAdvanced()
    $('#toggle_advanced_btn').on('click', toggleAdvanced)

    $('#seed-submit').on('click', submitButtonAction)
    $('#sample_phrase').on('click', generateSample)
    $('#qr_code_button').on('click', showQR)
    $('.modal-close').on('click', hideQR)
    $('.modal-background').on('click', hideQR)
    $('#export_file_button').on('click', exportFileButtonAction)
}


const enterIsSubmit = event => {
    if (event.which === 13) {
        $('#seed-submit').click();
        return false;
    }
};

function showAdvanced() {
    $("#advanced").removeClass('is-hidden');
    $('#toggle_advanced_btn').text(showLessText)

    var offset = $("#advanced").offset();
    $('html, body').animate({
        scrollTop: offset.top,
    }, 500);
}

function hideAdvanced() {
    $("#advanced").addClass('is-hidden');
    $('#toggle_advanced_btn').text(showMoreText)
}

const toggleAdvanced = () => {
    const $toggleButton = $('#toggle_advanced_btn');
    $toggleButton.text($toggleButton.text() === showMoreText ? showLessText : showMoreText)
    if ($("#advanced").hasClass('is-hidden')) {
        showAdvanced();
    } else {
        hideAdvanced();
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
    hideAdvanced()
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
        const rootFingerprint = logic.rootFingerPrintFromMnemonic(mnemonic)
        const fileExportData = logic.assembleExportFileData(rootFingerprint, pubKeys)

        $('#export_file_button').text(fileExportData.filename);
        $('#export_file_button').data("fileExportData", fileExportData)
        $("#checksum_word").text(lastword)
        $("#complete_phrase").text(mnemonic.toLowerCase())
        $("#network").text(network)

        $("#networkswitchlink").html(`&nbsp;<a href="?network=${otherNetwork()}">(switch to ${otherNetwork()})</a>`);
        $("#xpub_key").text(pubKeys.xpub)
        $("#root_fingerprint").text(rootFingerprint)

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

function ga() {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'UA-115028432-1');
}

function exportFileButtonAction() {
    let data = $('#export_file_button').data("fileExportData");
    return new Promise(() => {
        const url = window.URL.createObjectURL(new Blob([JSON.stringify(data.exportData)], {
            type: 'application/octet-stream'
        }));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = data.filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }).catch((err) => {
        throw new Error(err)
    });

}

module.exports = {
    init: init
}
