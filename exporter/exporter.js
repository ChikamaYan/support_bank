const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require("fs");
const xml = require("xml2js");
const Transaction = require("../transaction.js");

class Exporter {
    static exportTransactions(filepath, transactions, accounts, callback) {
        if (filepath.endsWith(".csv")) {
            Exporter.csvExport(filepath, transactions, accounts, callback);
        } else if (filepath.endsWith(".json")) {
            Exporter.jsonExport(filepath, transactions, accounts, callback);
        } else if (filepath.endsWith(".xml")) {
            Exporter.xmlExport(filepath, transactions, accounts, callback);
        }
    }

    static csvExport(filepath, transactions, accounts, callback) {
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
        callback(transactions, accounts, false);
    }

    static jsonExport(filepath, transactions, accounts, callback) {
        let json = JSON.stringify(transactions);
        fs.writeFile(filepath, json, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Exported into ${filepath}!`);
                callback(transactions, accounts, false);
            }
        });
    }

    static xmlExport(filepath, transactions, accounts, callback) {
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
                console.log(`Exported into ${filepath}!`);
                callback(transactions, accounts, false);
            }
        })
    }
}

module.exports = Exporter;