class Account {
    constructor(name) {
        this.name = name;
        this.balance = 0;
        this.trans = [];
    }

    updateBalance(amount) {
        this.balance += amount;
    };
}

module.exports = Account;