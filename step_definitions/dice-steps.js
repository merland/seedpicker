const {client: browser} = require('nightwatch-api')
const {Given, When, Then} = require('cucumber')
const expect = require("chai").expect
const step_helpers = require('./step_helpers')

const buttons = {
    "Add Word": "#add_word",
    "Copy Phrase": "#copy_phrase",
}

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
Then(/^the word list should contain (\d+) (?:word|words)$/, async noOfWords => {
    await browser
        .expect.elements("#word_table > tr")
        .count.to.equal(noOfWords);
});
When(/^I click the "([^"]*)" button$/, async function (button) {
    await browser.click(buttons[button])
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
Then(/^the input field number (\d+) and onward should be disabled$/, async function (firstDisabled) {
    for (let dieNo = 1; dieNo < firstDisabled; dieNo++) {
        await browser
            .expect.element("#d" + dieNo)
            .to.not.have.attribute('disabled');
    }
    for (let dieNo = firstDisabled; dieNo <= 11; dieNo++) {
        await browser
            .expect.element("#d" + dieNo)
            .to.have.attribute('disabled');
    }
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
When(/^I randomly enter (\d+) words$/, async function (noOfWords) {
    for (let i = 1; i <= noOfWords; i++) {
        for (let dieNo = 1; dieNo <= 11; dieNo++) {
            await browser.setValue(`#d${dieNo}`, step_helpers.randomDiceTrow())
        }

        await step_helpers.sleep_for_debug(50)
        await browser.click('#add_word')
    }
    console.log('');
});
Then(/^the phrase should have (\d+) words$/, async function (expectedLength) {
    await browser.getText("#phrase", function (result) {
        const phrase = result.value
        let words = phrase.trim().split(" ")
        expect(words).to.have.lengthOf(expectedLength)
    })

});
Then(/^the "([^"]*)" button should be "([^"]*)"$/, async function (button, state) {
    if (state === 'enabled') {
        await browser
            .expect.element(buttons[button])
            .to.not.have.attribute('disabled');
    } else {
        await browser
            .expect.element(buttons[button])
            .to.have.attribute('disabled');
    }

});
