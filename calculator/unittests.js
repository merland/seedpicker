let expect = require("chai").expect;
let assert = require("chai").assert;
let seedpicker = require("./seedpicker.js")
let bip39 = require("bip39")
let bip32 = require("bip32")

describe("Calculate the 24th word", function () {
    it("should return the first found valid checksum", () => {
        var my23words = "empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        assert(seedpicker.calculate2(my23words) === "bridge")
    })
})

describe("XPUB generation according to https://github.com/iancoleman/bip39/issues/351 (concept code)", function () {

    it('can generate a BIP32 xpub', () => {
        const mnemonic = 'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge'

        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const node = bip32.fromSeed(seed);
        let child = node.derivePath("m/48'/1'/0'/2'")

        let xpriv = child.toBase58();
        assert.strictEqual(xpriv, 'xprvA15jYQNsd7SQothyE7MkacnbZv6yiMxeeocf5e9BqCcBfucbSs3jVidbfLC5sbec6swy9uGF6go43hoqZetdnkKixo9d2r6CHM2EWS54qqM');

        const xpub = child.neutered().toBase58();
        assert.strictEqual(xpub, 'xpub6E55wuumTUzi2NnSL8tkwkjL7wwU7pgW22YFt2YoPY9AYhwjzQMz3Wx5WeReYiPkSwttHVQzLXKgjymgARe7yzpdRgQYFezEqnPSPywibYC');
    });
})