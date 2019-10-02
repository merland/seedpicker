/**
 * See https://github.com/satoshilabs/slips/blob/master/slip-0132.md
 */
const xpubPrefixes = {
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

module.exports =  {
    xpubPrefixes: xpubPrefixes
}