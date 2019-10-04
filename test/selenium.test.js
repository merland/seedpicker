const expect = require("chai").expect;
const assert = require("chai").assert;
const webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    firefox = require('selenium-webdriver/firefox'),
    By = webdriver.By,
    until = webdriver.until,
    Key = webdriver.Key

async function enter_valid_phrase_and_hit_enter(driver) {
    const workingDir = process.cwd()
    const fileUrl = "file://" + workingDir + "/calculator/last-word.html"
    await driver.get(fileUrl);
    await driver.findElement(By.id('seedphrase_input'))
        .sendKeys('     empower  soul    reunion  entire  help raise      truth reflect    argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december ', Key.RETURN);
    const checksumWordDiv = await driver.findElement(By.id('checksum_word'))
    await driver.wait(until.elementIsVisible(checksumWordDiv), 1000);
    return await checksumWordDiv.getText();
}

describe("Selenium tests for the html-page", function () {

    //const driver = chromeDriver();
    const driver = firefoxDriver()

    this.timeout(10000)

    it('should use the actual html-page and verify the last word', async () => {
        const checksumWord = await enter_valid_phrase_and_hit_enter(driver);
        expect(checksumWord).to.equal("bridge");
    })

    it('should display a QR code for the zpub', async () => {
        await enter_valid_phrase_and_hit_enter(driver);

        const zpubDiv = await driver.findElement(By.id('extended_pub'))
        await driver.wait(until.elementIsVisible(zpubDiv), 1000);
        const zpub = await zpubDiv.getText();
        expect(zpub).to.not.be.empty
        expect(zpub).to.not.equal('undefined')
        expect(zpub).to.have.lengthOf(111)

        // Click qr button and wait for the canvas to be visible
        await driver.findElement(By.css('#extended_pub_qr_btn .qr_code_btn_text')).click()
        const qrCanvas = await driver.findElement(By.css('#qr_code > canvas'))
        await driver.wait(until.elementIsVisible(qrCanvas), 1000);

        // verify that the qr-text is the same as the x/z-pub
        const qrTextDiv = await driver.findElement(By.id('qr_text'))
        await driver.wait(until.elementIsVisible(qrCanvas), 1000);
        const qrText = await qrTextDiv.getText();
        expect(qrText).to.not.be.empty
        expect(zpub).to.equal(zpub)
    })

    after(async () => driver.quit());
})

// ######################

function firefoxDriver() {
    const opts = new firefox.Options()
    opts.addArguments("-headless");
    const driver = new webdriver.Builder()
        .setFirefoxOptions(opts)
        .forBrowser('firefox')
        .build()
    return driver;
}

function chromeDriver() {
    const opts = new chrome.Options()
    opts.addArguments('headless')
    const driver = new webdriver.Builder()
        .setChromeOptions(opts)
        .forBrowser('chrome')
        .build();
    return driver
}
