const csv = require("csv-parser");
const fs = require("fs");
const Transaction = require("../transaction.js");
var moment = require("moment");
const TransactionParser = require("./transaction_parser");


class CsvParser extends TransactionParser {
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
                this.createTransactions();
                this.createAccount();
                callback(this._transactions, this.accounts);
            });
    }

    static parseDate(string) {
        return moment(string, "DD-MM-YYYY");
    }

    createTransactions() {
        this._transactions = [];
        for (let row of this.rawTrans) {
            this._transactions.push(new Transaction(CsvParser.parseDate(row["Date"]),
                row["From"], row["To"], row["Narrative"], parseFloat(row["Amount"])));

            if (!CsvParser.parseDate(row["Date"]).isValid()) {
                this.logger.error("Date error caused by entry: " + JSON.stringify(row));
            }

            if (isNaN(parseFloat(row["Amount"]))) {
                this.logger.error("NaN error caused by entry: " + JSON.stringify(row));
            }
        }
    }
}

module.exports = CsvParser;