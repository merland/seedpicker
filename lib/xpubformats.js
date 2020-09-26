/**
 * See https://github.com/satoshilabs/slips/blob/master/slip-0132.md
 */
const xpubPrefixes = {
    "xpub": {
        public: "0488b21e",
        private: "0488ade4"
    },
    "ypub": {
        public: "049d7cb2"
    },
    "zpub": {
        public: "04b24746"
    },
    "Ypub": {
        public: "0295b43f"
    },
    "Zpub": {
        public: "02aa7ed3",
        desc: "Extended Public Key"  //This text is visible in the GUI // TODO: move to presentation logic
    },
    "tpub": {
        public: "043587cf"
    },
    "upub": {
        public: "044a5262"
    },
    "Upub": {
        public: "024289ef"
    },
    "vpub": {
        public: "045f1cf6"
    },
    "Vpub": {
        public: "02575483",
        desc: "Extended Public Key" //This text is visible in the GUI // TODO: move to presentation logic
    }
}

module.exports =  {
    xpubPrefixes: xpubPrefixes
}