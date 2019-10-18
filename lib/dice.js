const wordlist = require('wordlist')

const dieRoll = (event) => {
    // const dieNo = $(this).attr("id").substring(1);
    // for (let i = 1; i < dieNo; i++) {
    //     const dieN = $(`#d${i}`).text();
    //     if(dieN === "") {
    //         // errorText
    //         // return
    //     }
    // }

    // const values = $(":text").map(() => this.value).get()

    const values = []
    for (let i = 0; i < 11; i++) {
        values.push($(":text")[i].value)
    }
    console.log(values)
    updateTable(values)
}

function updateTable(dice) {
    const biff = wordlist.filter(dice);
    const rows =
        biff
            .map(word => {
                let row = "        <tr>\n"
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

function init() {
    updateTable([]);
    $("input[type=text]").keyup(dieRoll)
}

module.exports = {
    init: init
}
