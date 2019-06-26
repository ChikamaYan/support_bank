const CsvHandler = require("./csv_parser.js");
const JsonHandler = require("./json_parser.js");
const XmlHandler = require("./xml_handler");

class Parser {
    constructor(filepath, logger, callback) {
        if (filepath.endsWith(".csv")) {
            this.parser = new CsvHandler(filepath, callback, logger);

        } else if (filepath.endsWith(".json")) {
            this.parser = new JsonHandler(filepath, logger);
            callback(this.parser.transactions, this.parser.accounts);
        } else if (filepath.endsWith(".xml")) {
            this.parser = new XmlHandler(filepath, logger);
            callback(this.parser.transactions, this.parser.accounts);
        }
    }
}

module.exports = Parser;