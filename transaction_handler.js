const Account = require("./account.js");

class TransactionHandler {

    constructor(){}

    getTransactions(rawTrans) {
        console.log("Shouldn't happen!");
    }


    getAccounts(transactions = this.getTransactions()) {
        let accounts = {};

        for (let t of transactions) {
            // create dictionary keys for new accounts
            if (!accounts.hasOwnProperty(t.from)) {
                accounts[t.from] = new Account(t.from);
            }
            if (!accounts.hasOwnProperty(t.to)) {
                accounts[t.to] = new Account(t.to);
            }

            // transfer the balance
            accounts[t.from].trans.push(t);
            accounts[t.to].trans.push(t);
            // logger.debug(t.amount);
            accounts[t.from].updateBalance(-t.amount);
            accounts[t.to].updateBalance(t.amount);
        }

        return accounts;
    }

}

module.exports = TransactionHandler;