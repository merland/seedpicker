let expect = require("chai").expect;
let assert = require("chai").assert;
let seedpicker = require("./seedpicker.js")

describe("Calculate the 24th word", function () {
    it("It should calculate all checksum words", () => {
        const my23words = "empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        const words = seedpicker.allLastWords(my23words);
        expect(words).to.have.lengthOf(8);

        const expectedWords = ["bridge", "danger", "draft", "hamster", "old", "route", "soccer", "wedding"]
        expect(words).to.have.members(expectedWords);
    })
    it("It should select a random checksum word", () => {
        const my23words = "empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        const lastWord = seedpicker.randomLastWord(my23words);

        const expectedWords = ["bridge", "danger", "draft", "hamster", "old", "route", "soccer", "wedding"]
        expect(lastWord).to.be.oneOf(expectedWords);
    })
})

describe("XPUB generation according to https://github.com/iancoleman/bip39/issues/351", function () {
    it('can generate a BIP32 xpub', () => {
        const mnemonic = 'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge'
        let derivationPath = "m/48'/1'/0'/2'";
        const result = seedpicker.xpubFromMnemonic(mnemonic, derivationPath);
        assert.strictEqual(result.xpub, 'xpub6E55wuumTUzi2NnSL8tkwkjL7wwU7pgW22YFt2YoPY9AYhwjzQMz3Wx5WeReYiPkSwttHVQzLXKgjymgARe7yzpdRgQYFezEqnPSPywibYC');
        //TODO// assert.strictEqual(result.zpub, 'Zpub74dhgUz3Koe39YL3wWvzC1G9BgGdDRM6AXENN5c7XKjLH697G85PNm8HMmJJ6xvVVhCUf2cE94RHdicZu3d6ixJVzpunpt6DGxnbm6xG5Ue');
    });
})
