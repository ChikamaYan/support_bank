let csv = require("csv-parser");
let fs = require("fs");

class CsvHandler {
    constructor(filepath, callback) {
        let rawTransactions = [];
        fs.createReadStream(filepath)
            .pipe(csv()) //??
            .on("data", (data) => {
                // console.log(data);
                rawTransactions.push(data);
            })
            .on("end", () => {
                callback(rawTransactions);
            });
    }
}

module.exports = CsvHandler;