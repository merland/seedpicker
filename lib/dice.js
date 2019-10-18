const wordlist = require('wordlist')

function init() {
    createTable();
    $(":text").keyup(dieRoll)
    clearInputs();
}

function createTable() {
    const rows =
        wordlist.filter([])
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

const addWordToPhrase = function() {
    const noOfFilteredWords = $("#word_table > tr:visible").length
    if(noOfFilteredWords > 1) {
        return;
    }
    const word = $("#word_table > tr:visible > td:nth-of-type(12)").text()
    const $phrase = $("#phrase");
    const phrase = $phrase.text();
    if(phrase.includes(word)) {
        $("#phrase_error").text(`Phrase already contains: '${word}'.`)
        return;
    }
    $phrase.text(phrase + " " + word)
    clearInputs()
};

function clearInputs() {
    const $inputs = $(":text")
    $inputs.val("")
    $inputs.prop('disabled', true)
    const $d1 = $("#d1");
    $d1.prop('disabled', false)
    $d1.focus()
    $("#add_word").prop('disabled', true)
    $("#add_word").off("click", addWordToPhrase)
}

const dieRoll = function() {
    const $input = $(this);
    const value = $input.val();
    $input.addClass('is-danger')
    if(typeof value === "undefined" || value.length === 0) {
        return;
    }
    const intValue = parseInt(value)
    if(isNaN(intValue)) {
        return;
    }
    if(intValue < 1 || intValue > 6) {
        return;
    }
    $input.removeClass('is-danger')

    setTimeout(filterWords, 50);

    const nextId = parseInt($input.attr("id").substring(1)) + 1;
    if (nextId === 12) {
        const $addWord = $("#add_word");
        $addWord.prop('disabled', false)
        $addWord.focus()
        $addWord.on("click", addWordToPhrase)
    } else {
        const $nextInput = $(`#d${nextId}`);
        $nextInput.prop('disabled', false)
        $nextInput.focus()
    }
    $("#phrase_error").text("")
}

const filterWords = function() {
    const values = $(":text").map(function () {
        return this.value
    }).get()
    updateTable(values)
}

function updateTable(dice) {
    $("#word_table > tr").hide()
    wordlist.wordNumbers(dice)
        .forEach(wordNo => $(`#word${wordNo}`).show())
}

module.exports = {
    init: init
}
