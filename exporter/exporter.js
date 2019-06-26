const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require("fs");
const xml2js = require("xml2js");
const Transaction = require("../transaction.js");
const moment = require("moment");

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
            let record = [{
                date: t.date.format("DD-MM-YYYY"),
                from: t.from,
                to: t.to,
                narrative: t.narrative,
                amount: t.amount
            }];
            promise = Promise.resolve(promise)
                .then(() => csvWriter.writeRecords(record))
        }

        Promise.resolve(promise).then(() => {
            console.log(`Exported into ${filepath}!`);
            callback(transactions, accounts, false);
        });
    }

    static jsonExport(filepath, transactions, accounts, callback) {

        let json = [];
        for (let t of transactions) {
            json.push({
                "Date": t.date.toISOString().slice(0, 19),
                "FromAccount": t.from,
                "ToAccount": t.to,
                "Narrative": t.narrative,
                "Amount": t.amount
            })
        }

        json = JSON.stringify(json);

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
        let builder = new xml2js.Builder();

        let newTrans = [];

        for (let t of transactions) {
            newTrans.push(Exporter.xmlFormatter(t));
        }
        let xml = {"TransactionList": {"SupportTransaction": newTrans}};

        let xmlString = builder.buildObject(xml);

        fs.writeFile(filepath, xmlString, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Exported into ${filepath}!`);
                callback(transactions, accounts, false);
            }
        })
    }

    static xmlFormatter(t) {
        let transaction = {
            "$": {"Date": [moment.duration(t.date.diff(moment("01-01-1900", "DD-MM-YYYY"))).asDays()]},
            "Description": [t.narrative],
            "Value": [t.amount],
            "Parties": {
                "From": [t.from],
                "To": [t.to]
            }
        };
        return transaction;
    }


}

module.exports = Exporter;