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

describe("XPUB calculation", function () {
    it('can generate a BIP32 xpub', () => {
        const mnemonic =
            'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge';
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const node = bip32.fromSeed(seed);
        const xpub = node.neutered().toBase58();

        assert.strictEqual(
            xpub,
            'xpub661MyMwAqRbcEmusjcD3WzYvmgmiK5ttAUy1Pa5pkRCrsPm9cBYoJ9jt6Da9ymucuhHbvdT6kNTKsq6tLMAek2p921jhN6jCFH7AwtJsqXK',
        );
    });
})