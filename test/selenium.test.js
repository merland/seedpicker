const expect = require("chai").expect;
const assert = require("chai").assert;
const webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    By = webdriver.By,
    until = webdriver.until,
    Key = webdriver.Key

describe("Selenium tests for the html-page", function () {
    const opts = new chrome.Options()
    opts.addArguments('headless')

    const driver = new webdriver.Builder()
        .setChromeOptions(opts)
        .forBrowser('chrome')
        .build();

    this.timeout(10000)

    it('should use the actual html-page and verify the last word', async () => {
        const workingDir = process.cwd()
        const fileUrl = "file://" + workingDir + "/calculator/last-word.html"
        await driver.get(fileUrl);
        await driver.findElement(By.id('seedphrase_ta'))
            .sendKeys('     empower  soul    reunion  entire  help raise      truth reflect    argue transfer chicken  ', Key.RETURN);
        const result1 = await driver.findElement(By.id('result1'))
        await driver.wait(until.elementIsVisible(result1), 1000);

        const checksumWord = await result1.getText()
        expect(checksumWord).to.not.equal("undefined")

        expect(checksumWord).to.equal("accuse");
    })

    after(async () => driver.quit());
})
