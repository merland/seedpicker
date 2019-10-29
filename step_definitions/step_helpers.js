async function getTextFrom(textSelector, browser) {
    return browser
            .getText(textSelector, result => {
                return Promise.resolve(result.value)
            });
}

function randomDiceTrow() {
    return Math.round(Math.random() * 5) + 1
}

function sleep(millis) {
    process.stdout.write('.');
    return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = {
    getTextFrom: getTextFrom,
    randomDiceTrow: randomDiceTrow,
    sleep_for_debug: sleep,
}
