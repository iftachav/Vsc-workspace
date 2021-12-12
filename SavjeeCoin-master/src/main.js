const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
//const b=require('./p2p');
const ec = new EC('secp256k1');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const json=require('./inputJson.json');
const topology = require('fully-connected-topology')
const {Wallet}= require('./wallet');

//const {randomBytes}=require('crypto');

//TODO::: create blockChain, read 30 transaction from file...

// Your private key goes here

//console.log("num is",arr.splice(0,3));

const {stdin, exit, argv} = process
const {log} = console
const {me, peers} = extractPeersAndMyPort()
const sockets = {}
const fullNodesPeer=4001

log('---------------------')
log('Welcome to p2p chat!')
log('me - ', me)
log('peers - ', peers)
log('connecting to peers...')

const myIp = toLocalIp(me)
const peerIps = getPeerIps(peers)
const fullNodeWallet=new Wallet('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
var myKey=0;
//ar myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
//if(b.getMe()==4002)
    //////myKey = ec.keyFromPrivate('abac45105bbc70c91bab3480c12342e90049f1a44f3e18c3e07c55e3273995ab');
//else if(b.getMe()==4003)
    ////myKey = ec.keyFromPrivate('b33c4590551140c91bab3480c39032e11119fffb4f3e4457e07c23e327bb95cc');
//console.log(b.getMe());

// From that we can calculate your public key (which doubles as your wallet address)
//const myWalletAddress = myKey.getPublic('hex');
//console.log(`Balance of xavier is ${savjeeCoin.getBalanceOfAddress(myWalletAddress)}`);

// Create new instance of Blockchain class
//if(b.me==4001){

//}

const secondKey = ec.keyFromPrivate('1b2c45907dec40c91bab3480c12432e90049f1a65f3e18c3e07c23e327399522');
//console.log("addres is ",myWalletAddress);
console.log("after");

//if(b.getMe()==4001){
    //const dataBuffer=fs.readFileSync('inputJson.json');
    //console.log("first json is",json.transaction[0])
const savjeeCoin = new Blockchain();
    //savjeeCoin.addTransaction(new Transaction('address1', myWalletAddress, 150));
    // Mine first block
savjeeCoin.minePendingTransactions(fullNodeWallet.getPublicKey());
    console.log(`Balance of xavier before  is ${savjeeCoin.getBalanceOfAddress(fullNodeWallet.getPublicKey())}`);
    //console.log(savjeeCoin.chain[0].tree.toString()) ;

topology(myIp, peerIps).on('connection', (socket, peerIp) => {
    const peerPort = extractPortFromIp(peerIp)
    log('connected to peer - ', peerPort)

    sockets[peerPort] = socket

      //print data when received
    socket.on('data', data => {
    //const tran=new Transaction
    //console.log("data is ",data);
    const tran=JSON.parse(data);
    //console.log("we recive",tran);
    for(let i=0;i<tran.length;i++){
        const transaticon=new Transaction(tran[i].fromAddress,tran[i].toAddress,tran[i].amount,tran[i].timestamp,tran[i].signature)
        //console.log("my amout is ",tran[i].amount,"and add is",transaticon.fromAddress);
        //console.log("my amout is ",tran[i].amount,"and balance is",savjeeCoin.getBalanceOfAddress(transaticon.fromAddress));
        log("check if valid",transaticon.isValid());
        savjeeCoin.addTransaction(transaticon);
    }
    var c=setInterval(savjeeCoin.minePendingTransactions,5000,fullNodeWallet.publicKey);
    //savjeeCoin.minePendingTransactions(fullNodeWallet.getPublicKey());
    //savjeeCoin.minePendingTransactions(fullNodeWallet.getPublicKey());
    //console.log("this is 4001 balance")
    //console.log(savjeeCoin.getBalanceOfAddress(fullNodeWallet.publicKey))
    //console.log("this is 4002 balance")
    //console.log(savjeeCoin.getBalanceOfAddress("0405bee6bbdc415fcd1aaeea34ec06030368fca12f164361ba1cd9a611630b24c7c4deb1897f0ed8d9da752496b4a624d65b014f1f5b0ea8973ee9e377dce63ee5"))
    //console.log("this is 4003 balance")
    //console.log(savjeeCoin.getBalanceOfAddress("04bd826ed81e95c1fdf631b344d706d41e87072b66a57f1653fbe3ef1b120957993fc57acb078219198ac15c415990400631b3870eadf427572d7c0e3b4f0e0553"))

    // console.log("my amout is ",tran[i].amount,"and balance is",savjeeCoin.getBalanceOfAddress(transaticon.fromAddress));
   // savjeeCoin.minePendingTransactions(fullNodeWallet.getPublicKey());
  })
})
    // Create a transaction & sign it with your key
var c=setInterval(savjeeCoin.minePendingTransactions,5000,fullNodeWallet.publicKey);
// const tx1 = new Transaction(fullNodeWallet.getPublicKey(), secondKey.getPublic('hex'), 20);
//     //tx1.signTransaction(myKey);

// fullNodeWallet.signMyTransaction(tx1);
// savjeeCoin.addTransaction(tx1);
    
    //console.log("sockets is",b.getSockets());
    //b.getSockets().write("write to sokcet ",tx1.toString())
    // Mine block
    //savjeeCoin.minePendingTransactions(myWalletAddress);

    // Create second transaction
// const tx2 = new Transaction(fullNodeWallet.getPublicKey(), 'address1', 10);
// fullNodeWallet.signMyTransaction(tx2);
// savjeeCoin.addTransaction(tx2);

// const tx3 = new Transaction(fullNodeWallet.getPublicKey(), 'address1', 5);
// fullNodeWallet.signMyTransaction(tx3);
// savjeeCoin.addTransaction(tx3);
// const tx4 = new Transaction(fullNodeWallet.getPublicKey(), 'address1', 3);
// fullNodeWallet.signMyTransaction(tx4);
// savjeeCoin.addTransaction(tx4);
// const tx5 = new Transaction(fullNodeWallet.getPublicKey(), 'address1', 8);
// fullNodeWallet.signMyTransaction(tx5);
// savjeeCoin.addTransaction(tx5);
// const tx6 = new Transaction(fullNodeWallet.getPublicKey(), 'address1', 4);
// fullNodeWallet.signMyTransaction(tx6);
// savjeeCoin.addTransaction(tx6);

    // Mine block
//////savjeeCoin.minePendingTransactions(fullNodeWallet.getPublicKey());
    
//savjeeCoin.minePendingTransactions(fullNodeWallet.getPublicKey());

   //var c=setInterval(savjeeCoin.minePendingTransactions,5000,myWalletAddress);

   //clearInterval(c);
   //setTimeout(clearInterval,10000,c);
   //var d=setInterval(printBalance,2000,savjeeCoin);
   //clearInterval(d);
console.log(`Balance of xavier is ${savjeeCoin.getBalanceOfAddress(fullNodeWallet.getPublicKey())}`);

     //console.log(`Balance of second is ${savjeeCoin.getBalanceOfAddress(secondKey.getPublic('hex'))}`);
///}//



// //savjeeCoin.addTransaction(new Transaction('address1', myWalletAddress, 150));
// // Mine first block
// savjeeCoin.minePendingTransactions(myWalletAddress);
// console.log(savjeeCoin.chain[0].tree.toString()) ;


// // Create a transaction & sign it with your key

// const tx1 = new Transaction(myWalletAddress, secondKey.getPublic('hex'), 100);
// tx1.signTransaction(myKey);
// savjeeCoin.addTransaction(tx1);



// // Mine block
// savjeeCoin.minePendingTransactions(myWalletAddress);

// // Create second transaction
// const tx2 = new Transaction(myWalletAddress, 'address1', 50);
// tx2.signTransaction(myKey);
// savjeeCoin.addTransaction(tx2);

// // Mine block
// savjeeCoin.minePendingTransactions(myWalletAddress);
// for (const block of savjeeCoin.chain) {
//         const tree=block.tree//         const root = tree.getRoot().toString('hex')
//         const leaf = tx2.calculateHash()
//         const proof = tree.getProof(leaf)
//         console.log("is tran in block",tree.verify(proof, leaf, root))
    
// }

// console.log();
// console.log(`Balance of xavier is ${savjeeCoin.getBalanceOfAddress(myWalletAddress)}`);
// console.log(`Balance of second is ${savjeeCoin.getBalanceOfAddress(secondKey.getPublic('hex'))}`);


// // Uncomment this line if you want to test tampering with the chain
// // savjeeCoin.chain[1].transactions[0].amount = 10;

// // Check if the chain is valid
// console.log();
// console.log('Blockchain valid?', savjeeCoin.isChainValid() ? 'Yes' : 'No');

function printBalance(savjeeCoin){
    console.log(`Balance of xavier is ${savjeeCoin.getBalanceOfAddress(myWalletAddress)}`);
}

 function mineEvery5Sex(coin,walletAddress){
     return coin.minePendingTransactions(walletAddress);
 }
//extract ports from process arguments, {me: first_port, peers: rest... }
function extractPeersAndMyPort() {
  return {me: argv[2], peers: argv.slice(3, argv.length)}
}

//'4000' -> '127.0.0.1:4000'
function toLocalIp(port) {
  return `127.0.0.1:${port}`
}


exports.getMe=()=>{
  return me;
}

exports.getSockets=()=>{
  return sockets;
}

//['4000', '4001'] -> ['127.0.0.1:4000', '127.0.0.1:4001']
function getPeerIps(peers) {
  return peers.map(peer => toLocalIp(peer))
}

//'hello' -> 'myPort:hello'
function formatMessage(message) {
  return `${me}>${message}`
}

//'127.0.0.1:4000' -> '4000'
function extractPortFromIp(peer) {
  return peer.toString().slice(peer.length - 4, peer.length);
}

//'4000>hello' -> '4000'
function extractReceiverPeer(message) {
  return message.slice(0, 4);
}

//'4000>hello' -> 'hello'
function extractMessageToSpecificPeer(message) {
  return message.slice(5, message.length);
}