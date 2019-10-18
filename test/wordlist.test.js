const { assert, expect } = require("chai");
const words = require("../lib/wordlist.js")

describe("Filter wordlist with some dice", function () {
    it('should return all words with an empty filter', function () {
        const rows = words.filter([])
        expect(rows).to.have.lengthOf(2048);
        expect(rows[0][11]).to.equal("abandon")
        expect(rows[2047][11]).to.equal("zoo")
    });
    it('should return the first half of words with 1 die', function () {
        const rows = words.filter(["1", "", "", "", "", "", "", "", "", "", ""])
        expect(rows).to.have.lengthOf(1024);
        expect(rows[0][11]).to.equal("abandon")
        expect(rows[1023][11]).to.equal("lend")
    });
    it("should filter down to 1 word with 11 dice", () => {
        const rows = words.filter([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        expect(rows).to.have.lengthOf(1);
        expect(rows[0][11]).to.equal("abandon")
    })
    it("should filter down to 2 words with 10 dice", () => {
        const rows = words.filter([1, 1, 1, 1, 1, 1, 1, 1, 4, 4])
        expect(rows).to.have.lengthOf(2);
        expect(rows[0][11]).to.equal("absorb")
        expect(rows[1][11]).to.equal("abstract")
    })
    it("should filter down to 4 words with 10 dice given 1-3 is 0 and 4-6 is 1", () => {
        const rows = words.filter([1, 3, 2, 5, 5, 2, 1, 3, 6])
        expect(rows).to.have.lengthOf(4);
        expect(rows[0][11]).to.equal("blush")
        expect(rows[1][11]).to.equal("board")
        expect(rows[2][11]).to.equal("boat")
        expect(rows[3][11]).to.equal("body")
    })
    it("should get the wordNumbers for two words", () => {
        const rows = words.wordNumbers([1, 1, 1, 1, 1, 1, 1, 1, 4, 4])
        expect(rows).to.have.lengthOf(2);
        expect(rows[0]).to.equal(7)
        expect(rows[1]).to.equal(8)
    })
})
