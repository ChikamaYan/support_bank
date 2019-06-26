const readline = require("readline-sync");

const Account = require("./account.js");
const CsvHandler = require("./csv_handler.js");
const JsonHandler = require("./json_handler.js");
const XmlHandler = require("./xml_handler");


const log4js = require("log4js");
log4js.configure({
    appenders: {
        file: {type: "file", filename: "./logs/support_bank.log"},
        std: {type: "stdout"}
    },
    categories: {
        default: {appenders: ["file"], level: "ALL"}
    }
});
const logger = log4js.getLogger();

function main() {
    console.log("Please input file path:");
    const filepath = readline.prompt().trim();

    if (filepath.endsWith(".csv")) {
        let csvHandler = new CsvHandler(filepath, takeQueryCommand, logger);

    } else if (filepath.endsWith(".json")) {
        let jsonHandler = new JsonHandler(filepath, logger);
        takeQueryCommand(jsonHandler.getAccounts());
    } else if (filepath.endsWith(".xml")) {
        let xmlHandler = new XmlHandler(filepath, logger);
        takeQueryCommand(xmlHandler.getAccounts());
    }
}
function takeQueryCommand(accounts) {
    let command = readline.prompt().toString();
    if (command === "List All") {
        for (let name in accounts) {
            console.log(`Name: ${name}    Balance: ${accounts[name].balance}`);
        }
    } else if (command.startsWith("List ")) {
        let ac_name = command.slice(5);
        for (let t of accounts[ac_name].trans) {
            console.log(`From: ${t.from}, To: ${t.to}, Date: ${t.date}, Narrative: ${t.narrative}`);
        }
    }
}

main();