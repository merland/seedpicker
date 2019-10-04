const bip32 = require('bip32')
const bip39 = require('bip39')
const b58 = require('bs58check')
const xpubformats = require('./xpubformats.js')

function keysFromMnemonic(mnemonic, network) {
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
    if (network === 'mainnet' && prefix === 'Vpub') return undefined
    if (network === 'testnet' && prefix === 'Zpub') return undefined
    let versionBytes = Buffer.from(getVersionBytes(prefix).vb, "hex")
    let data = b58.decode(xpub.trim());
    data = data.slice(4);
    data = Buffer.concat([versionBytes, data]);
    return b58.encode(data);
}

function derivationPathFromNetwork(network) {
    if (network == 'mainnet') return "m/48'/0'/0'/2'"
    if (network == 'testnet') return "m/48'/1'/0'/2'"
    throw new Error("Wrong network " + network)
}

function getVersionBytes(prefix) {
    return xpubformats.xpubPrefixes[prefix];
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


module.exports = {
    keysFromMnemonic: keysFromMnemonic,
    validate:validate
}