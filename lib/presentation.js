/**
 * Presentation related code that does not need unit testing
 */
const kjua = require('kjua');
const bip39 = require('bip39')
const xpubformats = require('./xpubformats.js')
const logic = require('./logic.js')

const title = "SeedPicker";
const subtitle = "Construct your own Seed Phrase and calculate the corresponding Extended Public Key";
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

$(document).keydown(function(event) {
    if (event.keyCode == 27) {
        //$('#modal01').hide();
        hideQR();
    }
});

function showAdvanced() {
    $("#advanced").removeClass('is-hidden');
    $('#toggle_advanced_btn').text(showLessText)
    scrollTo($("#advanced"));
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
    if (isMainnet()) return TESTNET;
    if (isTestnet()) return MAINNET;
    throw new Error(`Wrong network: [${network}]`)
}

function scrollTo(selector) {
    $('html, body').animate({
        scrollTop: selector.offset().top,
    }, 50);
}

function submitButtonAction(callback) {
    const phraseField = $("#seedphrase_input");
    const allow24thWord = $("#allow_24th_word_input");
    const validation =
        logic.validate(phraseField.val(), allow24thWord.is(':checked'));
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
    phraseField.text(validation.cleanedUpPhrase.join(" "))

    const $seedButton = $("#seed-submit");
    $seedButton.addClass("is-loading")

    setTimeout(() => {
        const checksumWord = logic.firstChecksumWordAlphabetically(validation.cleanedUpPhrase)
        const mnemonic = [...validation.cleanedUpPhrase.slice(0, 23), checksumWord].join(" ")
        const pubKeys = logic.keysFromMnemonic(mnemonic, network);
        const rootFingerprint = logic.rootFingerPrintFromMnemonic(mnemonic)
        const fileExportData = logic.assembleExportFileData(rootFingerprint, pubKeys)
        const qrData = logic.assembleQRCodeData(rootFingerprint, pubKeys)

        $('#export_file_button_text').text(`Download ${fileExportData.filename}`);

        $('#export_file_button').data("fileExportData", fileExportData)
        $('#qr_code_button').data("qrData", qrData)

        $("#checksum_word").text(checksumWord)
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
        $("#derivation_path").text(pubKeys.derivationPath.full)
        $("#results").removeClass('is-hidden');
        $seedButton.removeClass("is-loading")
        scrollTo($("#results"));
    }, 50)
}

function clearResults() {
    $("#checksum_word").text("")
    $("#complete_phrase").text("")
    $("#extended_pub_heading").text("")
    $("#extended_pub_result").text("")
    $("#network").text("")
    $("#networkswitchlink").html(`&nbsp;<a href="?network=${otherNetwork()}">(switch to ${otherNetwork()})</a>`);
    $("#derivation_path").text("")
    $("#xpub_key").text("")
}

function generateSample() {
    const samplePhrase = [...Array(23).keys()]
        .map(() => bip39.wordlists.EN.random())
        .join(" ");
    $("#seedphrase_input").val(samplePhrase)
}

function showQR() {
    const qrData = $('#qr_code_button').data("qrData");
    const qr_canvas = kjua({
        render: 'canvas',
        crisp: true,
        ecLevel: 'H',
        size: 450,
        fill: '#333',
        back: '#fff',
        text: qrData,
        rounded: 100,
        quiet: 2,
    });
    $("#qr_code").append(qr_canvas)
    $("#qr_text").text(qrData)
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
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
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
        let content = JSON.stringify(data.exportData, null, 4);
        const url = window.URL.createObjectURL(new Blob([content], {
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
