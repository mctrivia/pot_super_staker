let config;
try {
    config=require('./config');
} catch (e) {
    console.log("");
    console.log("");
    console.log("Config file not present.  Please create config.js using the template at top of index.js");
    console.log("");
    console.log("");
    throw "No Config";
}

//load addresses
const fs=require('fs');
let addresses=JSON.parse(fs.readFileSync('_addresses.json',{encoding:'utf8'}));
if (addresses.length<config.sendTimes) {
    console.log("");
    console.log("");
    console.log("Please run createAddresses to generate the addresses needed in your wallet.");
    console.log("");
    console.log("");
    throw "No Config";
}

let utxo=config.utxo;
let i=-1;




/**
 * TODO POT wallet is vary old so after installing node_module/digibyte-rpc/index.js needs signRawTransactionWithKey function modified to
async signRawTransactionWithKey(){
    return this.call('signrawtransaction',...(Array.from(arguments)));
}
 */
const DigiByteRPC=require('digibyte-rpc');
const wallet=new DigiByteRPC(
    config.walletStake.user,
    config.walletStake.pass,
    config.walletStake.host,
    config.walletStake.port
);


const sendTx=async(utxo,outputs)=>{
    let tx=await wallet.createRawTransaction([{txid:utxo.txid,vout:utxo.n}],outputs);
    let {hex} = await wallet.signRawTransactionWithKey(tx,[utxo], [config.walletSender.wif]);
    let txid=await wallet.sendRawTransaction(hex);
    console.log(txid);
    return wallet.decodeRawTransaction(hex);
}

const createTx=async()=>{
    //get address to send to
    i++;
    if (i>=addresses.length-1) {
        console.log("Done");
        clearInterval(timer);
        return;
    }
    let address=addresses[i];

    //create output list
    let outputs ={};
    outputs[address]=config.sendAmount;
    let leftOver=utxo.value-config.sendAmount-0.00000250;
    if (leftOver>0.00001000) {
        outputs[config.walletSender.address] = leftOver;
    } else {
        console.log("Will Finish");
        clearInterval(timer);
    }

    //send transaction
    utxo.vout=utxo.n;
    let decoded=await sendTx(utxo,outputs);

    //update utxo
    utxo=(decoded.vout[0].scriptPubKey.addresses[0]===config.walletSender.address)?decoded.vout[0]:decoded.vout[1];
    utxo.txid=decoded.txid;
    utxo.scriptPubKey=utxo.scriptPubKey.hex;
}

createTx().catch(console.log);
let timer=setInterval(createTx,664615);