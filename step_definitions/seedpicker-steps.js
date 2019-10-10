const { client: browser } = require('nightwatch-api');
const { Given, When, Then } = require('cucumber');
// const expect = require("chai").expect;

Given(/^I open the Seedpicker calculator$/, function () {
    const workingDir = process.cwd()
    const fileUrl = "file://" + workingDir + "/calculator/last-word.html"
    const apa = browser
        .url(fileUrl)
        .waitForElementVisible('body', 1000);
    return apa
});
Given(/^I enter the words "([^"]*)"$/, (words) => {
    return browser.setValue('#seedphrase_input', words)
});
When(/^I click the Calculate button$/, () => {
    return browser.click('#seed-submit')
});
When(/^I press ENTER$/, () => {
    return browser.setValue('#seedphrase_input', browser.Keys.ENTER)
});
Then(/^I can see the last word$/, () => {
    return browser
        .expect.element("#checksum_word")
        .to.be.present.before(1000);
});
Then(/^the last word should be "([^"]*)"$/, (word) => {
    return browser.expect.element("#checksum_word").text.to.equal(word)
});
