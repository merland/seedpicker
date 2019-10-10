const expect = require("chai").expect;

const webdriver = require('selenium-webdriver'),
    firefox = require('selenium-webdriver/firefox'),
    By = webdriver.By,
    until = webdriver.until,
    Key = webdriver.Key

async function open_the_last_word_page(driver) {
    const workingDir = process.cwd()
    const fileUrl = "file://" + workingDir + "/calculator/last-word.html"
    await driver.get(fileUrl);
}

async function enter_valid_phrase_and_hit_enter(driver) {
    await open_the_last_word_page(driver);
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

        const zpubDiv = await driver.findElement(By.id('extended_pub_result'))
        await driver.wait(until.elementIsVisible(zpubDiv), 1000);
        const zpub = await zpubDiv.getText();
        expect(zpub).to.not.be.empty
        expect(zpub).to.not.equal('undefined')
        expect(zpub).to.have.lengthOf(111)

        // Click qr button and wait for the canvas to be visible
        await driver.findElement(By.id('qr_code_button')).click()
        const qrCanvas = await driver.findElement(By.css('#qr_code > canvas'))
        await driver.wait(until.elementIsVisible(qrCanvas), 1000);

        // verify that the qr-text is the same as the x/z-pub
        const qrTextDiv = await driver.findElement(By.id('qr_text'))
        await driver.wait(until.elementIsVisible(qrCanvas), 1000);
        const qrText = await qrTextDiv.getText();
        expect(qrText).to.not.be.empty
        expect(zpub).to.equal(zpub)
    })

    it('should display the advanced section', async () => {
        // GIVEN I have entered a valid phrase
        await enter_valid_phrase_and_hit_enter(driver);

        // WHEN the last word calculation is done
        const zpubDiv = await driver.findElement(By.id('extended_pub_result'))
        await driver.wait(until.elementIsVisible(zpubDiv), 1000);

        // THEN the advanced button should be visible
        const advancedButton = await driver.findElement(By.id('toggle_advanced_btn'))
        let buttonIsDisplayed = await advancedButton.isDisplayed();
        expect(buttonIsDisplayed).to.be.true

        // AND the text should be "show more..."
        let buttonText = await advancedButton.getText();
        expect(buttonText).to.equal("Show more (for advanced users)")

        // AND the advanced section should NOT be visible
        const advancedDiv = await driver.findElement(By.id('advanced'))

        let advancedIsDisplayed = await advancedDiv.isDisplayed();
        expect(advancedIsDisplayed).to.be.false

        // AND WHEN we click the advanced button
        await advancedButton.click()

        // THEN the button text should be "show less"
        await driver.wait(until.elementIsVisible(advancedDiv), 1000);
        buttonText = await advancedButton.getText();
        expect(buttonText).to.equal("Show less")

        // AND the advanced section should be visible
        advancedIsDisplayed = await advancedDiv.isDisplayed();
        expect(advancedIsDisplayed).to.be.true
    })

    after(async () => driver.quit());
})

// ######################

function firefoxDriver() {
    const opts = new firefox.Options()
    opts.addArguments("-headless");
    return new webdriver.Builder()
        .setFirefoxOptions(opts)
        .forBrowser('firefox')
        .build();
}
