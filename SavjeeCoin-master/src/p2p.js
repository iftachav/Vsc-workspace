
const topology = require('fully-connected-topology')
const {Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {Wallet}= require('./wallet');
const json=require('./inputJson.json');
// class p2p{

// constructor(){
//   this.{me,peers}=extractPeersAndMyPort()
// }
const {stdin, exit, argv} = process
const {log} = console
const {me, peers} = extractPeersAndMyPort()
const sockets = {}
const fullNodesPeer=4001
var myWallet={};
var tranJson={};
var tran={};
var verfiytransactionJson

log('---------------------')
log('Welcome to p2p chat!')
log('me - ', me)
log('peers - ', peers)
log('connecting to peers...')

const myIp = toLocalIp(me)
const peerIps = getPeerIps(peers)
if(me==4002)
    myWallet=new Wallet('abac45105bbc70c91bab3480c12342e90049f1a44f3e18c3e07c55e3273995ab');
else 
    myWallet=new Wallet('b33c4590551140c91bab3480c39032e11119fffb4f3e4457e07c23e327bb95cc');
//log('peer ip is ',peerIps)
/// if(me==fullNodesPeer){
//         log('first peer is-',me)
//}

//connect to peers
topology(myIp, peerIps).on('connection', (socket, peerIp) => {
    // if(me==fullNodesPeer){
    //     log('first peer is-',me)
    // }
    
  const peerPort = extractPortFromIp(peerIp)
  log('connected to peer - ', peerPort)

  sockets[peerPort] = socket
  //sockets[4002].write(formatMessage("hii iftach111"))
 // console.log("peer inside ",peerPort);
  //if(me==4001)
    //sockets[4002].write(formatMessage("hii dolevvv"))
    // for(let i=0;i<json.transaction.length;i++){
    //   const tranJson=json.transaction[i];
    //   //console.log("tran json is ",json.transaction[i]);
    //   //console.log("my wallet address",myWallet.publicKey);
    //   const tran= new Transaction(tranJson.from,tranJson.to,tranJson.amount);
    //   if(tran.fromAddress==myWallet.publicKey){
    //     tran.signTransaction(myWallet.privateKey);
    //     const verfiytransactionJson=JSON.stringify(tran);
    //     socket.write(verfiytransactionJson)
    //     //setTimeout(function(){ socket.write(tranJson) }, 100);
    //   }
    // }
        var tranArray=[];
    for(let i=0;i<json.transaction.length;i++){
      tranJson=json.transaction[i];
      //console.log("tran json is ",json.transaction[i]);
      //console.log("my wallet address",myWallet.publicKey);
      tran= new Transaction(tranJson.from,tranJson.to,tranJson.amount);
      if(tran.fromAddress==myWallet.publicKey){
        tran.signTransaction(myWallet.privateKey);
        //verfiytransactionJson=JSON.stringify(tran);
        //console.log("verfiy is ",verfiytransactionJson);
        tranArray.push(tran);
        //socket.write(verfiytransactionJson);
        //setTimeout(function() {}, 1000);
      }

    }
    if(tranArray.length>0){
      verfiytransactionJson=JSON.stringify(tranArray);
      socket.write(verfiytransactionJson);

    }
    tranArray=[];

   stdin.on('data', data => { //on user input
    const message = data.toString().trim()
    if (message === 'exit') { //on exit
      log('Bye bye')
      exit(0)
    }


   //console.log("num of tran in mempol",json.transaction.length);


      
    //log("check if valid",tran.isValid());
    //const receiverPeer = extractReceiverPeer(message)
    // console.log("peer inside ",receiverPeer);
    // if (sockets[receiverPeer]) { //message to specific peer
    //   if (peerPort === receiverPeer) { //write only once
    //     sockets[receiverPeer].write(formatMessage(extractMessageToSpecificPeer(message)))
    //   }
    // } else { //broadcast message to everyone
    //   //socket.write(tranJson)
    // }
    
  })
  
  //print data when received
  // socket.on('data', data => {
    //const tran=new Transaction
    //const tran=JSON.parse(data);
   // const transaticon=new Transaction(tran.fromAddress,tran.toAddress,tran.amount,tran.timestamp,tran.signature)
   // log("tran is ",tran);
   // log("check if valid",transaticon.isValid());
    
 // })
})


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
//}
//exports.extractMessageToSpecificPeer=extractMessageToSpecificPeer
   
