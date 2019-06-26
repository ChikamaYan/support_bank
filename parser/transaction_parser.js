const Account = require("../account.js");



class TransactionParser {

    constructor() {
        this._transactions = [];
        this._accounts = [];
    }

    get transactions() {
        return this._transactions;
    }

    get accounts() {
        return this._accounts;
    }

    createAccount() {
        this._accounts = {};

        for (let t of this._transactions) {
            // create dictionary keys for new accounts
            if (!this._accounts.hasOwnProperty(t.from)) {
                this._accounts[t.from] = new Account(t.from);
            }
            if (!this._accounts.hasOwnProperty(t.to)) {
                this._accounts[t.to] = new Account(t.to);
            }

            // transfer the balance
            this._accounts[t.from].trans.push(t);
            this._accounts[t.to].trans.push(t);
            // logger.debug(t.amount);
            this._accounts[t.from].updateBalance(-t.amount);
            this._accounts[t.to].updateBalance(t.amount);
        }
    }

}

module.exports = TransactionParser;