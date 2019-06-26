const fs = require("fs");
const Transaction = require("./transaction.js");
var moment = require("moment");
const TransactionHandler = require("./transaction_handler");

class JsonHandler extends TransactionHandler {
    constructor(filepath, logger) {
        super();
        this.logger = logger;
        logger.debug(`Processing file ${filepath} with JSON handler`);
        this.rawTrans = JSON.parse(fs.readFileSync(filepath));
        this.createTransactions();
        this.createAccount();
    }

    static parseDate(string) {
        return moment(string, moment.ISO_8601);
    }

    createTransactions() {
        this._transactions = [];
        for (let row of this.rawTrans) {
            this._transactions.push(new Transaction(JsonHandler.parseDate(row["Date"]),
                row["FromAccount"], row["ToAccount"], row["Narrative"], row["Amount"]));

            if (!JsonHandler.parseDate(row["Date"]).isValid()) {
                this.logger.error("Date error caused by entry: " + JSON.stringify(row));
            }

        }
        return this._transactions;
    }
}

module.exports = JsonHandler;