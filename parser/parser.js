const CsvParser = require("./csv_parser.js");
const JsonParser = require("./json_parser.js");
const XmlParser = require("./xml_parser");

class Parser {
    constructor(filepath, logger, callback) {
        if (filepath.endsWith(".csv")) {
            this.parser = new CsvParser(filepath, callback, logger);

        } else if (filepath.endsWith(".json")) {
            this.parser = new JsonParser(filepath, logger);
            callback(this.parser.transactions, this.parser.accounts);
        } else if (filepath.endsWith(".xml")) {
            this.parser = new XmlParser(filepath, logger);
            callback(this.parser.transactions, this.parser.accounts);
        }
    }
}

module.exports = Parser;