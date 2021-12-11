const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {Transaction } = require('./blockchain');


class Wallet {
      /**
   * @param {string} privateKey
   */
    constructor(privateKey){
        this.privateKey=ec.keyFromPrivate(privateKey);
        this.publicKey=this.privateKey.getPublic('hex');
        this.balance=0;
    }

    getPublicKey(){
        return this.publicKey;
    }

    signMyTransaction(transaction){
        transaction.signTransaction(this.privateKey);

    }

}

module.exports.Wallet = Wallet;