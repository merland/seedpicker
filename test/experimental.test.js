const expect = require("chai").expect;
const assert = require("chai").assert;
const prefixes = require('../lib/xpubformats.js').xpubPrefixes
const bs58check = require('bs58check')
const typeforce = require('typeforce')
const ecc = require('tiny-secp256k1')
const bip32 = require('bip32');


const UINT256_TYPE = typeforce.BufferN(32);


function fromAnyPubtoAnyPub(zpub, targetPrefix) {
    if (!targetPrefix) {
        const versionBytes = Buffer.from(prefixes['xpub'].public, 'hex')
        const decoded = bs58check.decode(zpub);
        const sliced = decoded.slice(4);
        const concatenated = Buffer.concat([versionBytes, (sliced)]);
        return bs58check.encode(concatenated)
    } else {
        const versionBytes = Buffer.from(prefixes[targetPrefix].public, 'hex')
        const decoded = bs58check.decode(zpub);
        const sliced = decoded.slice(4);
        const concatenated = Buffer.concat([versionBytes, (sliced)]);
        return bs58check.encode(concatenated)
    }

}

describe("Conversion", function () {
    it("can convert from zpub back to xpub", () => {
        const result = fromAnyPubtoAnyPub("Vpub5m2hovZvH9sJ3jPFHvuY7FRpjsr1kgoa3whK3iCWWW5teKTWEpgXMSjZs74H4JkHTccsBHgvD7Tzp98qsgvEM4ZHyRnwLfZFghTCDsjhCfc");
        const expected = 'xpub6Do9J2BK1ZPtKkc71z1ohMH2N26eRa6yZu65hEijtk1F8LX3yjdNWTBv6p1yVgqE3RnVoesvFDnbTYkD1rbJo3opse5P75jELRJcR9ev9rU'
        assert.strictEqual(result, expected);
    })


    it("can convert from Vpub back to xpub", () => {
        const result = fromAnyPubtoAnyPub("Zpub74Mm2bFast3DSv9idN42wboqRkRoXAmZiPnCBHn42XbQriiRFTLmqhN7wvtd3wMy6B66BC5A3ktCMHb6kUaHY1HhSnadgJqCmbhmnAQispN");
        const expected = 'xpub6Do9J2BK1ZPtKkc71z1ohMH2N26eRa6yZu65hEijtk1F8LX3yjdNWTBv6p1yVgqE3RnVoesvFDnbTYkD1rbJo3opse5P75jELRJcR9ev9rU'
        assert.strictEqual(result, expected);
    })

    it("can convert from Zpub to Vpub", () => {
        const result = fromAnyPubtoAnyPub("Zpub74Mm2bFast3DSv9idN42wboqRkRoXAmZiPnCBHn42XbQriiRFTLmqhN7wvtd3wMy6B66BC5A3ktCMHb6kUaHY1HhSnadgJqCmbhmnAQispN", 'Vpub');
        const expected = 'Vpub5m2hovZvH9sJ3jPFHvuY7FRpjsr1kgoa3whK3iCWWW5teKTWEpgXMSjZs74H4JkHTccsBHgvD7Tzp98qsgvEM4ZHyRnwLfZFghTCDsjhCfc'
        assert.strictEqual(result, expected);
    })

})

describe("Deserialization", function () {


    it("should parse xpub", () => {

        const the_xpub = "xpub6Do9J2BK1ZPtKkc71z1ohMH2N26eRa6yZu65hEijtk1F8LX3yjdNWTBv6p1yVgqE3RnVoesvFDnbTYkD1rbJo3opse5P75jELRJcR9ev9rU";

        let bip32Result = bip32.fromBase58(the_xpub);
        assert.strictEqual(bip32Result.chainCode.toString('hex'), '5ff63d363ebf21234065a7d3f896707360c36657021391bbe9c08c66ff699ae4')

        assert.strictEqual(bip32Result.network.wif, 128)
        assert.strictEqual(bip32Result.network.bip32.private, 76066276)
        assert.strictEqual(bip32Result.network.bip32.private.toString(16), '488ade4')
        assert.strictEqual(bip32Result.network.bip32.public, 76067358)
        assert.strictEqual(bip32Result.network.bip32.public.toString(16), '488b21e')

        assert.strictEqual(bip32Result.privateKey, undefined)
        assert.strictEqual(bip32Result.depth, 4)

        assert.strictEqual(bip32Result.fingerprint.toString('hex'), '42d4ccdd')
        assert.strictEqual(bip32Result.identifier.toString('hex'), '42d4ccddafdb8566d4987f944c806f11cda33267')

        assert.strictEqual(bip32Result.index, 2147483650)
        assert.strictEqual(bip32Result.index, 0x80000002)

        assert.strictEqual(bip32Result.lowR, false)
        assert.strictEqual(bip32Result.parentFingerprint, 0x023bf4f9c)

        assert.strictEqual(bip32Result.isNeutered(), true)

        //assert.strictEqual(bip32Result.toWIF(), 128)

        //can we get the version from bip32 instead?
        const version = bs58check.decode(the_xpub).readUInt32BE(0);
        assert.strictEqual(version, parseInt(prefixes.xpub.public, 16))

    })

    //https://bitcoin.stackexchange.com/questions/80724/converting-xpub-key-to-core-format
    it("should parse an xpub found on StackExchange", () => {

        const key = "xpub661MyMwAqRbcG8Zah6TcX3QpP5yJApaXcyLK8CJcZkuYjczivsHxVL5qm9cw8BYLYehgFeddK5WrxhntpcvqJKTVg96dUVL9P7hZ7Kcvqvd";
        const result = analyze(key)

        assert.strictEqual(result.version, parseInt(prefixes.xpub.public, 16))
        assert.strictEqual(result.depth, 0)
        assert.strictEqual(result.parentFingerprint, 0)
        assert.strictEqual(result.childNumber, 0)
        assert.strictEqual(result.chainCode.length, 32)
        assert.strictEqual(result.chainCode.toString('hex'), "9f8b20f34eceef6ea60d35db00446763f7dc76bd60ec8cf6fd63dc912499cbd4")

        //"The last 33 bytes represent the hex version of the compressed public key (last 32 bytes for private keys)."
        assert.strictEqual(result.hd.publicKey.length, 33)
        assert.strictEqual(result.hd.publicKey.toString('hex'), '039edccce0e93f436a2839474123788b33a28ed7ad7cffc3a130889f232344ad1c')


        // ------------


        const buffer = bs58check.decode(key);

        let bip32Result = bip32.fromBase58(key);
        assert.strictEqual(bip32Result.chainCode.toString('hex'), '9f8b20f34eceef6ea60d35db00446763f7dc76bd60ec8cf6fd63dc912499cbd4')

        assert.strictEqual(bip32Result.network.wif, 128)
        assert.strictEqual(bip32Result.network.bip32.private, 76066276)
        assert.strictEqual(bip32Result.network.bip32.private.toString(16), '488ade4')
        assert.strictEqual(bip32Result.network.bip32.public, 76067358)
        assert.strictEqual(bip32Result.network.bip32.public.toString(16), '488b21e')

        assert.strictEqual(bip32Result.privateKey, undefined)
        assert.strictEqual(bip32Result.depth, 0)

        assert.strictEqual(bip32Result.fingerprint.toString('hex'), 'b2b363d1')
        assert.strictEqual(bip32Result.identifier.toString('hex'), 'b2b363d1cc07e2cf31631641f6882d863fc74989')

        assert.strictEqual(bip32Result.index, 0)
        assert.strictEqual(bip32Result.index, 0)

        assert.strictEqual(bip32Result.lowR, false)
        assert.strictEqual(bip32Result.parentFingerprint, 0)

        assert.strictEqual(bip32Result.isNeutered(), true)

        //assert.strictEqual(bip32Result.toWIF(), 128)

        //can we get the version from bip32 instead?
        const version = bs58check.decode(key).readUInt32BE(0);
        assert.strictEqual(version, parseInt(prefixes.xpub.public, 16))

        assert.strictEqual(bip32Result.publicKey.toString('hex'), '039edccce0e93f436a2839474123788b33a28ed7ad7cffc3a130889f232344ad1c')

    })

    it("should parse Zpub", () => {
        const the_xpub = "Zpub74Mm2bFast3DSv9idN42wboqRkRoXAmZiPnCBHn42XbQriiRFTLmqhN7wvtd3wMy6B66BC5A3ktCMHb6kUaHY1HhSnadgJqCmbhmnAQispN";
        const result = analyze(the_xpub)

        assert.equal(result.version, parseInt(prefixes.Zpub.public, 16))

        assert.strictEqual(result.depth, 4)
        assert.strictEqual(result.parentFingerprint, 0x023bf4f9c)
        assert.strictEqual(result.childNumber, 0x080000002)
        assert.strictEqual(result.chainCode.length, 32)
        assert.strictEqual(result.chainCode.toString('hex'), '5ff63d363ebf21234065a7d3f896707360c36657021391bbe9c08c66ff699ae4')


        assert.strictEqual(result.hd.publicKey.toString('hex'), '03b8c6692afe728dec414f6b0fb28930cdb85fdb9c17d087953168e5b8fa714581')

    })

    it("should parse xpriv", () => {
        const key = "xprvA2Kh71nWKoW83YSoB2u8bpTPpyE4DDD38LUudfXbbnuobnJFSjXkHEdeiXo2PQsiUrZ5ZYqhmXJFGK6P7oHpKDJMmu57DzMGzhfU4XBdiE2";
        const bip32Result = bip32.fromBase58(key)
        assert.strictEqual(bip32Result.toWIF(), 'L3cbB9YWdS4us2fL7ZTAynFw6U1TTRxMkjNSwLo12HbAWN5wH1dN')

        assert.strictEqual(bip32Result.chainCode.toString('hex'), 'b2ee267302d376bbf62b4c2d8c896a81a75572749ff54e7c2595d6056dacb7c0')

        assert.strictEqual(bip32Result.network.wif, 128)
        assert.strictEqual(bip32Result.network.bip32.private, 76066276)
        assert.strictEqual(bip32Result.network.bip32.private.toString(16), '488ade4')
        assert.strictEqual(bip32Result.network.bip32.public, 76067358)
        assert.strictEqual(bip32Result.network.bip32.public.toString(16), '488b21e')

        assert.strictEqual(bip32Result.privateKey.toString('hex'), 'becb56484535586da09d6d6e224f3c0260348003f6d203dff4b0d866816c4474')
        assert.strictEqual(bip32Result.depth, 4)

        assert.strictEqual(bip32Result.fingerprint.toString('hex'), 'd4ec414f')
        assert.strictEqual(bip32Result.identifier.toString('hex'), 'd4ec414fb86797d30f0b4d79947a6e02d453cf8a')

        assert.strictEqual(bip32Result.index, 0)
        assert.strictEqual(bip32Result.index, 0)

        assert.strictEqual(bip32Result.lowR, false)
        assert.strictEqual(bip32Result.parentFingerprint, 0xf1ef88b0)

        assert.strictEqual(bip32Result.isNeutered(), false)

    })

})

/**
 Mostly copied from bip32.js
 **/
function analyze(the_xpub) {

    const BITCOIN = {
        wif: 0x80,
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
    };
    const network = BITCOIN

    const buffer = bs58check.decode(the_xpub);
    if (buffer.length !== 78) throw new TypeError('Invalid buffer length');

    const version = buffer.readUInt32BE(0);

    // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ...
    const depth = buffer[4];

    // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
    const parentFingerprint = buffer.readUInt32BE(5);
    if (depth === 0) {
        if (parentFingerprint !== 0x00000000)
            throw new TypeError('Invalid parent fingerprint');
    }

    // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
    // This is encoded in MSB order. (0x00000000 if master key)
    const index = buffer.readUInt32BE(9);
    if (depth === 0 && index !== 0)
        throw new TypeError('Invalid index');

    // 32 bytes: the chain code
    const chainCode = buffer.slice(13, 45);

    let hd;
    // 33 bytes: private key data (0x00 + k)
    if (version === network.bip32.private) {
        if (buffer.readUInt8(45) !== 0x00)
            throw new TypeError('Invalid private key');
        const k = buffer.slice(46, 78);
        hd = fromPrivateKeyLocal(k, chainCode, network, depth, index, parentFingerprint);
        // 33 bytes: public key data (0x02 + X or 0x03 + X)
    } else {
        const X = buffer.slice(45, 78);
        hd = fromPublicKeyLocal(X, chainCode, network, depth, index, parentFingerprint);
    }


    return {
        version,
        depth,
        parentFingerprint,
        childNumber: index,
        chainCode,
        hd
    }
}

/**
 Mostly copied from bip32.js
 **/
function fromPublicKeyLocal(publicKey, chainCode, network, depth, index, parentFingerprint) {
    typeforce({
        publicKey: typeforce.BufferN(33),
        chainCode: UINT256_TYPE,
    }, {publicKey, chainCode});
    network = network || BITCOIN;
    // verify the X coordinate is a point on the curve
    if (!ecc.isPoint(publicKey))
        throw new TypeError('Point is not on the curve');

    return {
        publicKey,
        chainCode,
        network,
        depth,
        index,
        parentFingerprint
    }
}

function fromPrivateKeyLocal(privateKey, chainCode, network, depth, index, parentFingerprint) {
    typeforce({
        privateKey: UINT256_TYPE,
        chainCode: UINT256_TYPE,
    }, {privateKey, chainCode});
    network = network || BITCOIN;
    if (!ecc.isPrivate(privateKey))
        throw new TypeError('Private key not in range [1, n)');
    return new BIP32(privateKey, undefined, chainCode, network, depth, index, parentFingerprint);
}