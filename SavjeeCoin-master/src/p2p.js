
const topology = require('fully-connected-topology')
const { Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { Wallet } = require('./wallet');
const json = require('./inputJson.json');
const { stdin, exit, argv } = process
const { log } = console
const { me, peers } = extractPeersAndMyPort()
const sockets = {}
const fullNodesPeer = 4001
const fullNodesAddress = "04729aaee497f99ff7ed4da9b7a5c23912da6533783b5cee16839b1e2628bc3413672b407a68c7a15a6fe3ea238b16f26e7a35755e258a0b9fb3d007da7a2e9c94";
var myWallet = {};
var tranJson = {};
var tran = {};
var verfiytransactionJson
var flag;

log('---------------------')
log('Welcome to p2p chat!')
log('me - ', me)
log('peers - ', peers)
log('connecting to peers...')

const myIp = toLocalIp(me)
const peerIps = getPeerIps(peers)
if (me == 4002)
  myWallet = new Wallet('abac45105bbc70c91bab3480c12342e90049f1a44f3e18c3e07c55e3273995ab');
else
  myWallet = new Wallet('b33c4590551140c91bab3480c39032e11119fffb4f3e4457e07c23e327bb95cc');

//connect to peers
var t = topology(myIp, peerIps).on('connection', (socket, peerIp) => {
  const peerPort = extractPortFromIp(peerIp)
  log('connected to peer - ', peerPort)
  sockets[peerPort] = socket
  var tranArray = [];
  for (let i = 0; i < json.transaction.length; i++) {
    tranJson = json.transaction[i];
    tran = new Transaction(tranJson.from, tranJson.to, tranJson.amount, tranJson.priority);
    if (tran.fromAddress == myWallet.publicKey) {

      myWallet.signMyTransaction(tran)
      if (tran.priority == true) {
        const commission = new Transaction(tran.fromAddress, fullNodesAddress, 1);
        myWallet.signMyTransaction(commission)
        tranArray.push(commission);
      }
      tranArray.push(tran);
    }

  }
  if (tranArray.length > 0) {
    verfiytransactionJson = JSON.stringify(tranArray);
    socket.write(verfiytransactionJson);

  }
  tranArray = [];
  if (fullNodesPeer == peerPort) {
    var tt = t.peer("127.0.0.1:" + fullNodesPeer)
    tt.on('data', data => {
      if (flag != data) {
        log(data.toString("utf8"))
        flag = data;
      }
    })

  }

  stdin.on('data', data => { //on user input
    const message = data.toString().trim()
    if (message === 'exit') { //on exit
      log('Bye bye')
      exit(0)
    }

    if (message.includes("verify") || message.includes("exist") || message.includes("allCoins") || message.includes("burn") || message.includes("coinsInNet"))
      socket.write(message);
    if (message.includes("balance"))
      socket.write(message + myWallet.publicKey);

  })
})


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


