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

// function Ac(name) {
//     this.name = name;
//     this.balance = 0;
//     this.trans = [];
// }
//
// Ac.prototype.updateBalance = function (amount) {
//     this.balance += amount;
// };
//
// Ac.prototype.transact = function (ac, t) {
//     this.trans.push(t);
//     ac.trans.push(t);
//     let amount = parseFloat(t["Amount"]);
//     this.updateBalance(-amount);
//     ac.updateBalance(amount);
// };


module.exports = Account;