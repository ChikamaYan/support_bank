const csv = require("csv-parser");
const fs = require("fs");
const Transaction = require("./transaction.js");
var moment = require("moment");
const TransactionHandler = require("./transaction_handler");

class CsvHandler extends TransactionHandler {
    constructor(filepath, callback, logger) {
        super();
        this.logger = logger;
        this.rawTrans = [];
        logger.debug(`Processing file ${filepath} with CSV handler`);
        fs.createReadStream(filepath)
            .pipe(csv())
            .on("data", (data) => {
                this.rawTrans.push(data);
            })
            .on("end", () => {
                callback(this.getAccounts());
            });
    }

    static parseDate(string) {
        return moment(string, "DD-MM-YYYY");
    }

    getTransactions() {
        let transactions = [];
        for (let row of this.rawTrans) {
            transactions.push(new Transaction(CsvHandler.parseDate(row["Date"]),
                row["From"], row["To"], row["Narrative"], parseFloat(row["Amount"])));

            if (!CsvHandler.parseDate(row["Date"]).isValid()) {
                this.logger.error("Date error caused by entry: " + JSON.stringify(row));
            }

            if (isNaN(parseFloat(row["Amount"]))) {
                this.logger.error("NaN error caused by entry: " + JSON.stringify(row));
            }
        }
        return transactions;
    }
}

module.exports = CsvHandler;