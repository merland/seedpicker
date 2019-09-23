var expect = require("chai").expect;
var assert = require("chai").assert;
var seedpicker = require("./seedpicker.js")

describe("Checksum calculation", function () {
    describe("Calculate the 24th word", function () {
        it("should return the first found valid checksum", () => {
        	var my23words = "empower soul reunion entire help raise truth reflect argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december"
        	assert(seedpicker.calculate2(my23words) === "bridge")
        })
    })
})