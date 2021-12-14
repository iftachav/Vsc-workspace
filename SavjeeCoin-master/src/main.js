const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const json = require('./inputJson.json');
const topology = require('fully-connected-topology')
const { Wallet } = require('./wallet');
const { BloomFilter } = require('bloom-filters')
const { stdin, exit, argv } = process
const { log } = console
const { me, peers } = extractPeersAndMyPort()
const sockets = {}
const fullNodesPeer = 4001
var flag;

log('---------------------')
log('Welcome to p2p chat!')
log('me - ', me)
log('peers - ', peers)
log('connecting to peers...')

const myIp = toLocalIp(me)
const peerIps = getPeerIps(peers)
const fullNodeWallet = new Wallet('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');

const rexi = new Blockchain();

// Mine first block
rexi.minePendingTransactions(fullNodeWallet.publicKey);
for (let i = 0; i < json.transaction.length; i++) {
  tranJson = json.transaction[i];
  tran = new Transaction(tranJson.from, tranJson.to, tranJson.amount, tranJson.priority);
  if (tran.fromAddress == fullNodeWallet.publicKey) {
    fullNodeWallet.signMyTransaction(tran)
    rexi.addTransaction(tran);
  }
}
var t = topology(myIp, peerIps).on('connection', (socket, peerIp) => {

  const peerPort = extractPortFromIp(peerIp)
  log('connected to peer - ', peerPort)
  sockets[peerPort] = socket
  var tt = t.peer("127.0.0.1:" + peerPort)

  stdin.on('data', data => { //on user input
    const message = data.toString().trim()

    if (message === 'exit') { //on exit
      log('Bye bye')
      exit(0)
    }
    if (flag != message) {
      if (message.includes("balance"))
        console.log(rexi.getBalanceOfAddress(fullNodeWallet.publicKey).toString());
      else if (message.includes("verify"))
        console.log(rexi.checkIfVerfiy(data.toString("utf8").slice(7,)).toString());
      else if (message.includes("exist"))
        console.log(rexi.checkIfExist(data.toString("utf8").slice(6,)).toString());
      else if (message.includes("allCoins"))
        console.log(rexi.getAllCoinsAmount().toString());
      else if (message.includes("burn"))
        console.log(rexi.getHowManyBurned().toString());
      flag = message

    }

  });

  socket.on('data', data => {
    if (data.includes("verify")) {
      tt.write(rexi.checkIfVerfiy(data.toString("utf8").slice(7,)).toString())
    }
    else if (data.includes("exist")) {
      tt.write(rexi.checkIfExist(data.toString("utf8").slice(6,)).toString())
    }
    else if (data.includes("balance")) {
      tt.write(rexi.getBalanceOfAddress(data.toString("utf8").slice(7,)).toString())
    }
    else if (data.includes("allCoins")) {
      tt.write(rexi.getAllCoinsAmount().toString())
    }
    else if (data.includes("burn")) {
      tt.write(rexi.getHowManyBurned().toString())
    }
    else {
      const tran = JSON.parse(data);
      for (let i = 0; i < tran.length; i++) {
        const transaticon = new Transaction(tran[i].fromAddress, tran[i].toAddress, tran[i].amount, tran[i].priority, tran[i].timestamp, tran[i].signature)
        rexi.addTransaction(transaticon);
      }
      for (let i = 0; i < rexi.pendingTransactions.length / 3; i++) {
        rexi.minePendingTransactions(fullNodeWallet.publicKey);
      }
    }
  })
})


function printBalance(savjeeCoin) {
  console.log(`Balance of xavier is ${savjeeCoin.getBalanceOfAddress(myWalletAddress)}`);
}

function mineEvery5Sex(coin, walletAddress) {
  return coin.minePendingTransactions(walletAddress);
}
//extract ports from process arguments, {me: first_port, peers: rest... }
function extractPeersAndMyPort() {
  return { me: argv[2], peers: argv.slice(3, argv.length) }
}

//'4000' -> '127.0.0.1:4000'
function toLocalIp(port) {
  return `127.0.0.1:${port}`
}


exports.getMe = () => {
  return me;
}

exports.getSockets = () => {
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