const wordlist = require('wordlist')

const init = function () {
    createTable([]);
    $('input[type="number"]').keyup(dieRoll)
    clearInputs();
    enableFieldOne();
}

const createTable = function (dieValues) {
    const rows =
        wordlist.filter(dieValues)
            .map(word => {
                let row = `         <tr id="word${word[12]}">\n`
                for (let i = 0; i < 13; i++) {
                    row += `             <td>${word[i]}</td>\n`
                }
                return row + "        </tr>\n";
            })
            .join("\n")
    const $wordTable = $("#word_table");
    $wordTable.empty()
    $wordTable.append(rows)
}

function enableCopyPhrase() {

}

const addWordToPhrase = function () {
    const noOfFilteredWords = $("#word_table > tr").length
    if (noOfFilteredWords > 1) {
        return;
    }
    const word = $("#word_table > tr > td:nth-of-type(12)").text()
    const $phrase = $("#phrase");
    const phrase = $phrase.text();
    let separator = phrase === "" ? "" : " ";
    const updatedPhrase = phrase + separator + word;
    $phrase.text(updatedPhrase)
    updateHelperText($phrase.text())
    if (updatedPhrase.split(" ").length === 23) {
        console.log("We're done!");
        clearInputs()
        enableCopyPhrase()
    } else {
        clearInputs()
        enableFieldOne()
    }
};

const updateHelperText = function (currentPhrase) {
    const words = noOfWordsRandomized(currentPhrase);
    const msg = `${words} word${words > 1 ? "s" : ""} of 23. ${23 - words} more to go.`
    $("#phrase_helper").text(msg)
}

function noOfWordsRandomized(currentPhrase) {
    return currentPhrase.trim().split(" ").length;
}

const clearInputs = function () {
    const $inputs = $('input[type="number"]')
    $inputs.val("")
    $inputs.prop('disabled', true)
    const $addWord = $("#add_word");
    $addWord.prop('disabled', true)
    $addWord.off("click", addWordToPhrase)
}

const enableFieldOne = function () {
    const $d1 = $("#d1");
    $d1.prop('disabled', false)
    $d1.focus()
}

const isValid = function (dieRollInput) {
    const value = dieRollInput.val();
    dieRollInput.addClass('is-danger')
    if (typeof value === "undefined" || value.length === 0) {
        dieRollInput.val("")
        return false
    }
    const intValue = parseInt(value)
    if (isNaN(intValue)) {
        dieRollInput.val("")
        return false
    }
    if (intValue < 1 || intValue > 6) {
        dieRollInput.val("")
        return false
    }
    dieRollInput.removeClass('is-danger')
    return true
}

const dieRoll = function () {
    const $input = $(this);
    if (!isValid($input)) {
        return;
    }
    setTimeout(filterWords, 50);

    const nextId = parseInt($input.attr("id").substring(1)) + 1;
    if (nextId === 12) {
        enableAddWordButton();
    } else {
        moveFocusToNextInput(nextId);
    }
    $("#phrase_error").text("")
}

const enableAddWordButton = function () {
    const $addWord = $("#add_word");
    $addWord.prop('disabled', false)
    $addWord.focus()
    $addWord.on("click", addWordToPhrase)
};

const moveFocusToNextInput = function (nextId) {
    const $nextInput = $(`#d${nextId}`);
    $nextInput.prop('disabled', false)
    $nextInput.focus()
};

const filterWords = function () {
    const values =
        $('input[type="number"]')
            .map(function () {
                return this.value
            })
            .get()
    createTable(values)
}

module.exports = {
    init: init
}
