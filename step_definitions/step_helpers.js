async function getTextFrom(textSelector, browser) {
    return browser
            .getText(textSelector, result => {
                return Promise.resolve(result.value)
            });
}

module.exports = {
    getTextFrom: getTextFrom,
}
