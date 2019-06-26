const TransactionHandler = require("./transaction_handler");
const fs = require("fs");
const Transaction = require("./transaction.js");
var moment = require("moment");
var parseString = require("xml2js").parseString;

var temp;

class XmlHandler extends TransactionHandler {
    constructor(filepath, logger) {
        super();
        this.logger = logger;
        logger.debug(`Processing file ${filepath} with XML handler`);

        parseString(fs.readFileSync(filepath), function (err, result) {
            temp = result;
        });

        this.rawTrans = temp;
    }

    static parseDate(string) {
        return moment("01-01-1900", "DD-MM-YYYY").add(parseInt(string), "days");
    }

    getTransactions() {
        let transactions = [];
        for (let row of this.rawTrans["TransactionList"]["SupportTransaction"]) {

            let date = XmlHandler.parseDate(row["$"]["Date"]);
            let amount = parseFloat(row["Value"][0]);

            transactions.push(new Transaction(date,
                row["Parties"][0]["From"][0], row["Parties"][0]["To"][0], row["Description"][0], amount));


            if (!date.isValid()) {
                this.logger.error("Date error caused by entry: " + JSON.stringify(row));
            }

            if (isNaN(amount)) {
                this.logger.error("NaN error caused by entry: " + JSON.stringify(row));
            }
        }
        return transactions;
    }

}

module.exports = XmlHandler;