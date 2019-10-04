/**
 * Presentation logic that does not need unit testing
 */
const kjua = require('kjua');

function init() {
    $('#extended_pub_qr_btn .qr_code_btn_text').click(showQR)
    $('#qr_popup .close').click(hideQR)
}

function showQR() {
    const zpub = $("#extended_pub").text();
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
    const el = kjua(qrOptions);
    $("#qr_code").append(el)
    $("#qr_text").text(zpub)
    $('#qr').show()
}

const hideQR = () => {
    $('#qr').hide()
    $('#qr_code > canvas').remove()
    $('#qr_text').text('')
};

module.exports = {
    init: init
}