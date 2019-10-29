const {client: browser} = require('nightwatch-api')
const {Given, When, Then} = require('cucumber')
const expect = require("chai").expect
const step_helpers = require('./step_helpers')

Given(/^I open the Dice randomizer$/, async () => {
    const workingDir = process.cwd()
    const fileUrl = "file://" + workingDir + "/calculator/dice.html"
    await browser
        .url(fileUrl)
        .waitForElementVisible('body', 1000)
});
Given(/^I enter (\d+) in dice number (\d+)$/, async (dieValue, diceNo) => {
    await browser.setValue(`#d${diceNo}`, dieValue)
});
Then(/^the focus should shift to dice number (\d+)$/, async diceNo => {
    await browser
        .element("#d" + diceNo)
        .elementActive(function (result) {
        });
});
Then(/^the word list should contain (\d+) (?:word|words)$/, async noOfWords => {
    await browser
        .expect.elements("#word_table > tr")
        .count.to.equal(noOfWords);
});
When(/^I click the Add Word button$/, async function () {
    await browser.click('#add_word')
});
Then(/^the word in the word list should be "([^"]*)"$/, async function (word) {
    const tableRow =
        await step_helpers.getTextFrom("#word_table > tr", browser)
});
Then(/^the last word of the phrase should be "([^"]*)"$/, async function (word) {
    await browser
        .expect.elements("#phrase").text
        .to.endWith(word);
});
Then(/^the last word of the phrase should be the one word in the word list$/, async function () {
    let phrase = "";
    let wordRow = "";

    await browser.getText("#phrase", function (result) {
        phrase = result.value
    })

    let lastWord = phrase.trim().split(" ").pop()
    expect(lastWord.length).to.be.gt(0)

    await browser.getText("#word_table > tr", function (result) {
        wordRow = result.value
    })
    let columns = wordRow.trim().split(" ")
    let word = columns[11]

    expect(word).to.not.equal("")
    expect(word).to.not.equal("undefined")
    expect(word).to.equal(lastWord)
});
Then(/^all input fields but the first is disabled$/, async function () {
    await browser
        .expect.element("#d1")
        .to.not.have.attribute('disabled');

    for (let i = 2; i <= 11; i++) {
        await browser
            .expect.element("#d" + i)
            .to.have.attribute('disabled');
    }
});
Then(/^the Add Word button is disabled$/, async function () {
    await browser
        .expect.element("#add_word")
        .to.have.attribute('disabled');
});
Then(/^the helper text should be "([^"]*?)"$/, async function (expected) {
    await browser
        .expect.elements("#phrase_helper").text
        .to.equal(expected);
});
Then(/^the error text should be blank$/, async function () {
    await browser
        .expect.elements("#phrase_error").text
        .to.equal("")
});
When(/^I randomly select (\d+) words$/, async function () {
    for (let i = 1; i <= 11; i++) {

    }
});
