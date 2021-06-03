# POT Super Staker

This is a simple script to generate 260 PotCoin addresses and move funds from a paper wallet to these addresses over 48h.
The purpose of this script is to try to help stabilise the pot block chain timing.  You will need at least 260001 POT to effectively run this script.  More can be used by  increasing the sendAmount in config.js or increasing the sendTime value though this should stay a multiple of 260.

## Step 1: Install
```bash
npm install
nano node_module/digibyte-rpc/index.js
 ```
now find the line where it says ```async signRawTransactionWithKey(){``` and replace it and next 2 lines with
```javascript
async signRawTransactionWithKey(){
    return this.call('signrawtransaction',...(Array.from(arguments)));
}
```

## Step 2: paper wallet
Create a paper wallet.  Use any method you like.  I generally use https://iancoleman.io/bip39/ and just take a random address and private key.  You will need this in config step.

## Step 3: configure
create config.js it should look like this

```javascript
module.exports={
    walletSender: {
        wif:    "WIF private key of a paper wallet",
        address:"its pot coin address"
    },
    walletStake: {
        user:   'value in potcoin.conf under rpcuser',
        pass:   'value in potcoin.conf under rpcpassword',
        host:   '127.0.0.1',
        port:   8770
    },
    utxo:   { //look up initial address in a block explorer and fill in the following info for first utxo
        "txid": "dae59f12c5e7652fc3c1a89a5be92580aabd44dc2880cbe855d0c43f93e089b7",
        "value": 260000.998,
        "n": 0,
        "scriptPubKey": "76a91444e680c0ad4c303b67fda8acb027009f8d6f3a2f88ac"
    },
    sendAmount: 1000,
    sendTimes:  260
}
```

## Step 4: create addresses
Run 
```bash
node createAddresses
```
to create the addresses in your core wallet.

## Step 5: fund
Send 260,001 POT to the paper wallet you created in Step 2

## Step 6: run
Use pm2 or another handler to run index.js.  don't run direct because it needs to run for 48h uninterrupted