const readline = require("readline-sync");
const csv = require("csv-parser");
const fs = require("fs");

function createAcs(t, accounts) {
    for (let row of t) {
        if (!accounts.hasOwnProperty(row["From"])) {
            accounts[row["From"]] = new Ac(row["From"]);
        }
        if (!accounts.hasOwnProperty(row["To"])) {
            accounts[row["To"]] = new Ac(row["To"]);
        }
        accounts[row["From"]].transact(accounts[row["To"]], row);
    }
}

function main() {
    let accounts = {}; // ac name : ac object

    readTrans((t) => {
        createAcs(t, accounts);
        // console.log(accounts);
        let command = readline.prompt().toString();
        if (command === "List All") {
            for (let name in accounts) {
                console.log(`Name: ${name}    Balance: ${accounts[name].balance}`);
            }
        } else if (command.startsWith("List ")) {
            let ac_name = command.slice(5);
            for (let t of accounts[ac_name].trans) {
                console.log(`From: ${t["From"]}, To: ${t["To"]}, Date: ${t["Date"]}, Narrative: ${t["Narrative"]}`);

            }
        }

    });
}

function readTrans(callback) {
    let trans = [];
    fs.createReadStream("./transactions.csv")
        .pipe(csv()) //??
        .on("data", (data) => {
            // console.log(data);
            trans.push(data);
        })
        .on("end", () => {
            callback(trans)
        });
}


function Ac(name) {
    this.name = name;
    this.balance = 0;
    this.trans = [];
}

Ac.prototype.updateBalance = function (amount) {
    this.balance += amount;
};

Ac.prototype.transact = function (ac, t) {
    this.trans.push(t);
    ac.trans.push(t);
    let amount = parseFloat(t["Amount"]);
    this.updateBalance(-amount);
    ac.updateBalance(amount);
};


main();