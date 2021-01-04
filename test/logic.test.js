const expect = require("chai").expect;
const assert = require("chai").assert;
const logic = require("../lib/logic.js")

describe("Calculate the 24th word", function () {
    it("should calculate all checksum words", () => {
        const my23words = "empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        const words = logic.allLastWords(my23words);
        expect(words).to.have.lengthOf(8);

        const expectedWords = ["bridge", "danger", "draft", "hamster", "old", "route", "soccer", "wedding"]
        expect(words).to.have.members(expectedWords);
    })
    it("should handle mixed casing", () => {
        const my23words = "Empower soul reuNion entire help raiSe truth reflect arguE transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        const words = logic.allLastWords(my23words);
        const expectedWords = ["bridge", "danger", "draft", "hamster", "old", "route", "soccer", "wedding"]
        expect(words).to.have.members(expectedWords);
    })

    //https://github.com/merland/seedpicker/issues/13
    it("should select the first checksum word, alphabetically", () => {
        const my23words = [
          "empower", "soul", "reunion", "entire", "help", "raise", "truth",
          "reflect", "argue", "transfer", "chicken", "narrow", "oak", "friend",
          "junior", "figure", "auto", "small", "push", "spike", "next",
          "pledge", "december"
        ]
        const lastWord = logic.firstChecksumWordAlphabetically(my23words);

        const expectedWords = ["bridge"]
        expect(lastWord).to.be.oneOf(expectedWords);
    })
    it("should correct the checksum word", () => {
        const my24words = [
          "empower", "soul", "reunion", "entire", "help", "raise", "truth",
          "reflect", "argue", "transfer", "chicken", "narrow", "oak", "friend",
          "junior", "figure", "auto", "small", "push", "spike", "next",
          "pledge", "december", "zoo"
        ]
        const lastWord = logic.firstChecksumWordAlphabetically(my24words);

        const expectedWords = ["wedding"]
        expect(lastWord).to.be.oneOf(expectedWords);
    })
    it('should have an empty error message if supplied words are valid', function () {
        const result = logic.validate("empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december");
        expect(result.errorMessage).to.be.empty
        expect(result.valid).to.be.true
    });
    it('should not be valid if the number of words are not exactly 23', function () {
        const result = logic.validate("empower soul reunion")
        expect(result.errorMessage).to.include("Please enter 23 words")
        expect(result.valid).to.be.false
    });
    it('should check the words against the dictionary', function () {
        const result = logic.validate("mpower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge decembe");
        expect(result.errorMessage).to.include("mpower")
        expect(result.errorMessage).to.include("decembe")
        expect(result.valid).to.be.false
    });
    it('should ignore whitespaces', function () {
        const result = logic.validate("     empower  soul    reunion  entire  help raise      truth reflect    argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december")
        expect(result.errorMessage).to.be.empty
        expect(result.valid).to.be.true
    });
})

describe("XPUB generation", function () {
    it('can generate a BIP32 xpub', () => {
        const mnemonic = 'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge'
        const result = logic.keysFromMnemonic(mnemonic, "testnet");
        assert.strictEqual(result.xpub, 'xpub6E55wuumTUzi2NnSL8tkwkjL7wwU7pgW22YFt2YoPY9AYhwjzQMz3Wx5WeReYiPkSwttHVQzLXKgjymgARe7yzpdRgQYFezEqnPSPywibYC');
    });


    it('can generate xpub in other formats', () => {
        const mnemonic = 'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge'
        const result = logic.keysFromMnemonic(mnemonic, "mainnet");
        assert.strictEqual(result.xpub, 'xpub6Do9J2BK1ZPtKkc71z1ohMH2N26eRa6yZu65hEijtk1F8LX3yjdNWTBv6p1yVgqE3RnVoesvFDnbTYkD1rbJo3opse5P75jELRJcR9ev9rU');

        //Zpub -  bitcoin mainnet P2WSH
        assert.strictEqual(result.Zpub, 'Zpub74Mm2bFast3DSv9idN42wboqRkRoXAmZiPnCBHn42XbQriiRFTLmqhN7wvtd3wMy6B66BC5A3ktCMHb6kUaHY1HhSnadgJqCmbhmnAQispN');

        //Illegal combination - Vpub is for testnet
        assert.isUndefined(result.Vpub);
    });

    it('can generate Testnet Vpub', () => {
        const mnemonic = 'empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december bridge'
        const result = logic.keysFromMnemonic(mnemonic, "testnet");
        assert.strictEqual(result.xpub, 'xpub6E55wuumTUzi2NnSL8tkwkjL7wwU7pgW22YFt2YoPY9AYhwjzQMz3Wx5WeReYiPkSwttHVQzLXKgjymgARe7yzpdRgQYFezEqnPSPywibYC');

        //Vpub - bitcoin testnet P2WSH
        assert.strictEqual(result.Vpub, 'Vpub5mJeTpJNj5U7kMZac5nVMet8VogqSwP6W59VEW2a1JDp4gtCFVR8tWVjGwTx7LJos8jFf8DzJR166aAK2Fy3Y1a6XU86VEpGC4Y2CjogHVw');

        //Illegal combination - Zpub is for mainnet
        assert.isUndefined(result.Zpub)
    });

})

describe("XPUB conversion", function () {
    const the_xpub = 'xpub6E55wuumTUzi2NnSL8tkwkjL7wwU7pgW22YFt2YoPY9AYhwjzQMz3Wx5WeReYiPkSwttHVQzLXKgjymgARe7yzpdRgQYFezEqnPSPywibYC'
    const the_Vpub = 'Vpub5mJeTpJNj5U7kMZac5nVMet8VogqSwP6W59VEW2a1JDp4gtCFVR8tWVjGwTx7LJos8jFf8DzJR166aAK2Fy3Y1a6XU86VEpGC4Y2CjogHVw'
    const the_Zpub = 'Zpub74dhgUz3Koe39YL3wWvzC1G9BgGdDRM6AXENN5c7XKjLH697G85PNm8HMmJJ6xvVVhCUf2cE94RHdicZu3d6ixJVzpunpt6DGxnbm6xG5Ue'
    const the_zpub = 'zpub6sjcZFFbkr5fiyAfzrU1MvvLTtEN14fVrFahSpLa9YtveuaCVih7HeGMZ4LpYXhbGE8VnSc7Fr2nWYzobpU9aUBqAMoPRUdDPEWjBBNL5LJ'

    it('can convert from xpub to Vpub', () => {
        assert.strictEqual(logic.convertPubkey(the_xpub, 'Vpub'), the_Vpub)
    })
    it('can convert from xpub to Zpub', () => {
        assert.strictEqual(logic.convertPubkey(the_xpub, 'Zpub'), the_Zpub)
    })
    it('can convert from Vpub to Zpub', () => {
        assert.strictEqual(logic.convertPubkey(the_Vpub, 'Zpub'), the_Zpub)
    })
    it('can convert from Zpub to Vpub', () => {
        assert.strictEqual(logic.convertPubkey(the_Zpub, 'Vpub'), the_Vpub)
    })
    it('can convert from xpub to zpub', () => {
        assert.strictEqual(logic.convertPubkey(the_xpub, 'zpub'), the_zpub)
    })
})

describe("root fingerprint", function() {
  it("can calculate the root fingerprint given a valid 24 word mnemonic", () => {
    const mnemonic =
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon " +
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon " +
        "abandon abandon abandon art";
    assert.strictEqual(logic.rootFingerPrintFromMnemonic(mnemonic), "5436d724");
  });
});
