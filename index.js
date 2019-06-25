const readline = require("readline-sync");
const csv = require("csv-parser");
const fs = require("fs");
const Account = require("./account.js");
const Transaction = require("./transaction.js");
var moment = require("moment");


const log4js = require("log4js");
log4js.configure({
    appenders: {
        file: {type: "file", filename: "./logs/support_bank.log"},
        std: {type: "stdout"}
    },
    categories: {
        default: {appenders: ["file"], level: "ALL"}
    }
});
var logger = log4js.getLogger();

const CSV_FILE = "dodgy_trans.csv";//"./transactions.csv"; //

function main() {
    readTrans(function (rawTrans) {
        let transactions = createTransaction(rawTrans);

        let accounts = createAccounts(rawTrans, transactions); // ac name : ac object

        takeCommand(accounts);
    });
}

function createTransaction(rawTrans) {
    let transactions = [];
    for (let row of rawTrans) {
        // logger.debug(row["Date"]+ "   " + moment(row["Date"]).toISOString());
        transactions.push(new Transaction(moment(row["Date"], "DD-MM-YYYY"),
            row["From"], row["To"], row["Narrative"], parseFloat(row["Amount"])));

        if (!moment(row["Date"], "DD-MM-YYYY").isValid()) {
            logger.error("Date error caused by entry: " + JSON.stringify(row));
        }

        if (isNaN(parseFloat(row["Amount"]))) {
            logger.error("NaN error caused by entry: " + JSON.stringify(row));
        }
    }
    return transactions;
}

function createAccounts(rawTrans, transactions) {
    let accounts = {};

    for (let t of transactions) {
        // create dictionary keys for new accounts
        if (!accounts.hasOwnProperty(t.from)) {
            accounts[t.from] = new Account(t.from);
        }
        if (!accounts.hasOwnProperty(t.to)) {
            accounts[t.to] = new Account(t.to);
        }

        // transfer the balance
        accounts[t.from].trans.push(t);
        accounts[t.to].trans.push(t);
        // logger.debug(t.amount);
        accounts[t.from].updateBalance(-t.amount);
        accounts[t.to].updateBalance(t.amount);
    }

    return accounts;
}

function takeCommand(accounts) {
    let command = readline.prompt().toString();
    if (command === "List All") {
        for (let name in accounts) {
            console.log(`Name: ${name}    Balance: ${accounts[name].balance}`);
        }
    } else if (command.startsWith("List ")) {
        let ac_name = command.slice(5);
        for (let t of accounts[ac_name].trans) {
            console.log(`From: ${t.from}, To: ${t.to}, Date: ${t.date}, Narrative: ${t.narrative}`);
        }
    }
}

function readTrans(callback) {
    let rawTransactions = [];
    fs.createReadStream(CSV_FILE)
        .pipe(csv()) //??
        .on("data", (data) => {
            // console.log(data);
            rawTransactions.push(data);
        })
        .on("end", () => {
            callback(rawTransactions)
        });
}

main();