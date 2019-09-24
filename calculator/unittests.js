let expect = require("chai").expect;
let assert = require("chai").assert;
let seedpicker = require("./seedpicker.js")

describe("Calculate the 24th word", function () {
    it("should return the first found valid checksum", () => {
        var my23words = "empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        assert(seedpicker.calculate2(my23words) === "bridge")
    })
})

describe("XPUB generation according to https://github.com/iancoleman/bip39/issues/351", function () {
    it('can generate a BIP32 xpub', () => {
        const mnemonic = 'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge'
        let derivationPath = "m/48'/1'/0'/2'";
        const xpub = seedpicker.xpubFromMnemonic(mnemonic, derivationPath);
        assert.strictEqual(xpub, 'xpub6E55wuumTUzi2NnSL8tkwkjL7wwU7pgW22YFt2YoPY9AYhwjzQMz3Wx5WeReYiPkSwttHVQzLXKgjymgARe7yzpdRgQYFezEqnPSPywibYC');
    });
})