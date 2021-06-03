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

const DigiByteRPC=require('digibyte-rpc');
const wallet=new DigiByteRPC(
    config.walletStake.user,
    config.walletStake.pass,
    config.walletStake.host,
    config.walletStake.port
);

const fs=require('fs');
let addresses=JSON.parse(fs.readFileSync('_addresses.json',{encoding:'utf8'}));
(async()=>{
    while (addresses.length<config.sendTimes) {
        addresses.push(await wallet.getNewAddress('super_staker'));
    }
    fs.writeFileSync('_addresses.json',JSON.stringify(addresses));
    console.log("Complete Address Creation");
})().catch((e)=>{
    fs.writeFileSync('_addresses.json',JSON.stringify(addresses));
    console.log("Its possible you may need to unlock your wallet first and run the keypoolrefill command");
});
