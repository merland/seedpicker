const expect = require("chai").expect;
const assert = require("chai").assert;

describe("Selenium tests for the html-page", function () {
    const webdriver = require('selenium-webdriver'),
        chrome = require('selenium-webdriver/chrome'),
        By = webdriver.By,
        until = webdriver.until,
        Key = webdriver.Key
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

        const expectedWords = ["accuse", "actor", "afford", "alpha", "answer", "any", "army",
            "attract", "awkward", "banana", "between", "bird", "bonus",
            "bottom", "bulb", "bulk", "cake", "captain", "ceiling", "cheese", "cinnamon",
            "claw", "combine", "common", "cover", "cricket", "crush", "curve", "decade",
            "derive", "diet", "disagree", "double", "drastic", "dune", "elevator", "else",
            "envelope", "evil", "excess", "explain", "fantasy", "field", "filter", "float",
            "forest", "fruit", "future", "ghost", "ginger", "goat", "gun", "hard", "height",
            "horn", "hurry", "idea", "increase", "invest", "jazz", "joy", "knife", "lake",
            "lend", "letter", "loan", "loyal", "mango", "matrix", "mesh", "miracle", "mix",
            "muffin", "near", "next", "note", "object", "omit", "outer", "paddle", "pause",
            "peasant", "pill", "police", "power", "private", "property", "quiz", "rain",
            "razor", "remain", "resource", "rice", "room", "round", "sauce", "scheme",
            "season", "sheriff", "shove", "sign", "slice", "smoke", "soul", "speak", "sponsor",
            "still", "strong", "super", "surge", "talent", "teach", "throw", "toe", "toss",
            "traffic", "trim", "twist", "unique", "update", "valley", "venture", "virus",
            "voyage", "weekend", "when", "wire", "year"]
        expect(checksumWord).to.be.oneOf(expectedWords);
    })

    after(async () => driver.quit());
})
