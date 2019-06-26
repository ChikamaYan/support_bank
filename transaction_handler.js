const Account = require("./account.js");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require("fs");
const xml = require("xml2js");
const Transaction = require("./transaction.js");


class TransactionHandler {

    constructor() {
        this._transactions = [];
        this._accounts = [];
    }

    get transactions() {
        return this._transactions;
    }

    get accounts() {
        return this._accounts;
    }

    createAccount() {
        this._accounts = {};

        for (let t of this._transactions) {
            // create dictionary keys for new accounts
            if (!this._accounts.hasOwnProperty(t.from)) {
                this._accounts[t.from] = new Account(t.from);
            }
            if (!this._accounts.hasOwnProperty(t.to)) {
                this._accounts[t.to] = new Account(t.to);
            }

            // transfer the balance
            this._accounts[t.from].trans.push(t);
            this._accounts[t.to].trans.push(t);
            // logger.debug(t.amount);
            this._accounts[t.from].updateBalance(-t.amount);
            this._accounts[t.to].updateBalance(t.amount);
        }
    }


    static exportTransactions(filepath, transactions) {
        if (filepath.endsWith(".csv")) {
            TransactionHandler.csvExport(filepath, transactions);
        } else if (filepath.endsWith(".json")) {
            TransactionHandler.jsonExport(filepath, transactions);
        } else if (filepath.endsWith(".xml")) {
            TransactionHandler.xmlExport(filepath, transactions);
        }
    }

    static csvExport(filepath, transactions) {
        const csvWriter = createCsvWriter({
            path: filepath,
            header: [
                {id: "date", title: "Date"},
                {id: "from", title: "From"},
                {id: "to", title: "To"},
                {id: "narrative", title: "Narrative"},
                {id: "amount", title: "Amount"}
            ]
        });

        let promise;
        for (let t of transactions) {
            let record = [{date: t.date, from: t.from, to: t.to, narrative: t.narrative, amount: t.amount}];
            promise = Promise.resolve(promise)
                .then(() => csvWriter.writeRecords(record))
        }
    }

    static jsonExport(filepath, transactions) {
        let json = JSON.stringify(transactions);
        fs.writeFileSync(filepath, json);
    }

    static xmlExport(filepath, transactions) {
        let builder = new xml.Builder();
        let newTrans = [];

        for (let t of transactions) {
            newTrans.push(new Transaction(t.date.toString(), t.from, t.to, t.narrative, t.amount))
        }
        let xmlString = builder.buildObject(newTrans);

        fs.writeFile(filepath, xmlString, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('updated!');
            }
        })
    }
}

module.exports = TransactionHandler;