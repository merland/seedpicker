const bip32 = require('bip32')
const bip39 = require('bip39')
const b58 = require('bs58check')
const prefixes = require('./xpubformats.js').xpubPrefixes
const crypto = require('crypto')
const cryptoHash = require('crypto-hashing')

function keysFromMnemonic(mnemonic, network) {
    const derivationPath = derivationPathFromNetwork(network)
    return {
        xpub: xpubFromMnemonic(mnemonic, derivationPath),
        Zpub: anyPubFrom(xpubFromMnemonic(mnemonic, derivationPath), 'Zpub', network),
        Vpub: anyPubFrom(xpubFromMnemonic(mnemonic, derivationPath), 'Vpub', network),
        derivationPath: derivationPath,
        network
    }
}

function xpubFromMnemonic(mnemonic, derivationPath) {
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const node = bip32.fromSeed(seed)
    const child = node.derivePath(derivationPath.full)
    return child.neutered().toBase58()
}

/**
 * Convert a pubkey to any other prefix
 */
function convertPubkey(source, targetPrefix) {
    const versionBytes = Buffer.from(prefixes[targetPrefix].public, 'hex')
    const decoded = b58.decode(source);
    const sliced = decoded.slice(4);
    const concatenated = Buffer.concat([versionBytes, (sliced)]);
    return b58.encode(concatenated)
}

/**
 * Convert from xpub to other formats
 */
function anyPubFrom(source, targetPrefix, network) {
    if (!network) throw new Error("network not set")
    if (network === 'mainnet' && targetPrefix === 'Vpub') return undefined
    if (network === 'testnet' && targetPrefix === 'Zpub') return undefined
    return convertPubkey(source, targetPrefix)
}

// These paths are selected from the defaults
// that Electrum and Specter (and Coldcard?) use for Segwit Multisig (P2WSH)
function derivationPathFromNetwork(network) {
    if (network == 'mainnet') return {
        full: "m/48'/0'/0'/2'",
        short: "/48'/0'/0'/2'",
    }
    if (network == 'testnet') return {
        full: "m/48'/1'/0'/2'",
        short: "/48'/1'/0'/2'"
    }
    throw new Error("Wrong network " + network)
}

/**
 * https://github.com/merland/seedpicker/issues/23
 */
function rootFingerPrintFromMnemonic(mnemonic) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);

    //The root/parent xpub (Before any derivation)
    let rootXpub = node.neutered().toBase58();

    let b58decoded = b58.decode(rootXpub);
    let sha = crypto
        .createHash("sha256")
        .update(b58decoded.slice(-33))
        .digest();
    let hash160 = cryptoHash("ripemd160", sha);
    let fingerprint = hash160.slice(0, 4).toString("hex");
    return fingerprint;
}

function validate(suppliedSeedPhrase, allow24thWord) {
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
    if (wordCount !== 23 && !(allow24thWord && wordCount === 24)) {
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
        const msg = "Words not in the dictionary: " + nonDictionaryWords
        return validationReply(msg)
    }
    return validationReply("", trimmedWords.join(" "))
}

function validationReply(errorMsg, words) {
    return {
        valid: errorMsg === "",
        errorMessage: errorMsg,
        cleanedUpPhrase: words && words.split(" ")
    }
}

function firstChecksumWordAlphabetically(suppliedSeedPhrase) {
    const dictionary = bip39.wordlists[bip39.getDefaultWordlist()]
    const bits = suppliedSeedPhrase
        .map(word => dictionary.indexOf(word).toString(2).padStart(11, 0))
        .join("")
        .slice(0, 256)
        .padEnd(256, "0")
    const hex = bits.match(/..../g)
        .map(b => parseInt(b, 2).toString(16))
        .join("")
    const mnemonic = bip39.entropyToMnemonic(hex)
    return mnemonic.split(" ")[23]
}

function allChecksumWords(suppliedSeedPhrase) {
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

function generateSample() {
    const samplePhrase = [...Array(23).keys()]
        .map(() => bip39.wordlists.EN.random())
        .join(" ");
    $("#seedphrase_input").val(samplePhrase)
}

function assembleExportFileData(rootFingerPrint, pubKeys) {
    let thePubKey = pubKeys.Zpub;

    //FIXME encapsulate .network
    let isTestnet = pubKeys.network === 'testnet';
    if (isTestnet) thePubKey = pubKeys.Vpub;

    return {
        //What is going into the actual export file
        exportData: {
            "xfp": rootFingerPrint,
            "p2wsh": thePubKey,
            "p2wsh_deriv": pubKeys.derivationPath.full,
        },
        filename: `seedpickerxp-${rootFingerPrint}.json`,
    }
}

function assembleQRCodeData(rootFingerPrint, pubKeys) {
    let thePubKey = pubKeys.Zpub;

    //FIXME encapsulate .network
    let isTestnet = pubKeys.network === 'testnet';
    if (isTestnet) thePubKey = pubKeys.Vpub;

    return "[" + rootFingerPrint + pubKeys.derivationPath.short + "]" + thePubKey
}


module.exports = {
    keysFromMnemonic: keysFromMnemonic,
    validate: validate,
    allLastWords: allChecksumWords,
    firstChecksumWordAlphabetically: firstChecksumWordAlphabetically,
    generateSample: generateSample,
    convertPubkey: convertPubkey,
    rootFingerPrintFromMnemonic: rootFingerPrintFromMnemonic,
    assembleExportFileData: assembleExportFileData,
    assembleQRCodeData: assembleQRCodeData,
};
