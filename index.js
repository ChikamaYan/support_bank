const readline = require("readline-sync");
const Exporter = require("./exporter/exporter");
const Parser = require("./parser/parser");

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

    new Parser(filepath, logger, takeCommand)
}

function takeCommand(transactions, accounts) {

    let command = readline.prompt().trim().toString();

    if (command === "list all") {
        for (let name in accounts) {
            console.log(`Name: ${name}    Balance: ${accounts[name].balance}`);
        }
    } else if (command.startsWith("list ")) {
        let ac_name = command.slice(5);
        for (let t of accounts[ac_name].trans) {
            console.log(`From: ${t.from}, To: ${t.to}, Date: ${t.date}, Narrative: ${t.narrative}`);
        }
    } else if (command.startsWith("export file ")) {
        let destination = command.slice(12);
        Exporter.exportTransactions(destination, transactions)
    }
}

main();