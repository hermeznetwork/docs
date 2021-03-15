# Exchanges

This example shows a possible flow of how an exchange would use Hermez.

## Pre-requisites
-  Exchange already has some Hermez accounts for each trading token (`HEZEx-ETH`, `HEZEx-DAI`,...). 
-  User has a Hermez account (`HEZUser-ETH`)
![](exchanges/Exchange-init.jpg)

Existing accounts are regular Hermez accounts, consisting of an L2 account linked to an Ethereum account where funds can be withdrawn.

## User Transfers Tokens to Exchange
A User wants to transfer 10 ETH from his Hermez account to the exchange for the first time. To do so, the user requests to transfer some funds via some sort of front end provided by the exchange.
After the request is done, the exchange provides the address of an internal Hermez account where the user can deposit his tokens. This account doesn't have an Ethereum counterpart account, 
and thus the creation is very inexpensive. Once the user has received the L2 account address, he can perform the transfer normally.
In the meantime, the exchange is monitoring the status of this account, and once the user transfer is completed, the exchange can transfer the funds to its main account. This process is depicted in the diagram below.

The creation of this user account by the exchange is only done once. 

![](exchanges/Exchange-transfer.jpg)

### Flow 
1. User requests to do a transfer to the exchange from his Hermez account using some front-end.
2. Exchange creates an L2 (internal) account on behalf of the user (`L2ExUser-ETH`) and provides the address via a front-end. This account is controlled by the exchange. 
```js
  // create new bjj private key to receive user transactions
  const pvtBjjKey = Buffer.allocUnsafe(32).fill("1");

  // create rollup internal account from bjj private key
  const resExchangeWallet = await hermez.HermezWallet.createWalletFromBjjPvtKey(pvtBjjKey);
  const hermezExchangeUserWallet = resExchangeWallet.hermezWallet;

  // share public bjj key with the user
  console.log(`Transfer funds to this hermez address:\n   ${hermezExchangeUserWallet.publicKeyBase64}\n\n`); 
```
3. User does a L2 transfer from his account to the destination account using the web wallet
```js
  const infoAccountUser = (await hermez.CoordinatorAPI.getAccounts(hermezUserWallet.hermezEthereumAddress, [tokenERC20.id]))
    .accounts[0];

  const state = await hermez.CoordinatorAPI.getState();
  const usdTokenExchangeRate = tokenERC20.USD;
  const fee = usdTokenExchangeRate ? state.recommendedFee.createAccountInternal / usdTokenExchangeRate : 0;

  // user creates transaction to deposit 10 ether into exchange account
  // deposit 10 ether
  const userDepositToExchange = hermez.Utils.getTokenAmountBigInt("10.0", 18);
  const compressedUserDepositToExchange = hermez.HermezCompressedAmount.compressAmount(userDepositToExchange);
  // the following transaction would:
  // - create an account for the exchange in hermez network
  // - transfer to exchange account 0.1 eth
  const transferToExchange = {
    from: infoAccountUser.accountIndex,
    to: hermezExchangeUserWallet.publicKeyBase64,
    amount: compressedUserDepositToExchange,
    fee : fee
  };
  console.log("transferToExchange: ", transferToExchange, fee);
  // send tx to hermez network
  await hermez.Tx.generateAndSendL2Tx(transferToExchange, hermezUserWallet, tokenERC20);
```
4. Exchange monitors balance of the account `L2ExUser-ETH`, and once transfer has completed, exchange performs transfer from `L2ExUser-ETH` to `L2Ex-ETH` for 10 ETH.
```js
  const pollingExchangeAddr = true;
  while (pollingExchangeAddr){
    const accountExchangeInfo = await hermez.CoordinatorAPI.getAccounts(hermezExchangeUserWallet.publicKeyBase64, [tokenERC20.id]);
    if (accountExchangeInfo.accounts.length === 0){
      console.log("Waiting for user deposit to be forged...");
      await sleep(10000);
    } else {
      console.log("<=== Received deposit from user ===>");
      console.log(`accountExchangeInfo:\n ${accountExchangeInfo.accounts[0]}`);
      break;
    }
  }

  const infoAccountExchangeUser = (await hermez.CoordinatorAPI.getAccounts(hermezExchangeUserWallet.publicKeyBase64, [tokenERC20.id]))
   .accounts[0];


  // Transfer funds to main exchange account
  // generate L2 transaction
  const l2TxTransfer = {
    from: infoAccountExchangeUser.accountIndex,
    to:  infoAccountExchange.accountIndex,
    amount: compressedUserDepositToExchange,
    fee: fee
  };
  console.log(l2TxTransfer)

  const transferResponse = await hermez.Tx.generateAndSendL2Tx(l2TxTransfer, hermezExchangeUserWallet, tokenERC20).catch(console.log);
  console.log("transferResponse: ", transferResponse);
```

### Full Example
```js
const hermez = require("@hermeznetwork/hermezjs");

async function sleep (timeout) {
  await new Promise(resolve => setTimeout(resolve, timeout));
}

async function main(){
  // INITIALIZATION
  // initialize hermezjs and prepare two Hermez accounts with some ETH (user and exchange accounts)

  // configure Ethereum provider
  hermez.Providers.setProvider(ethNodeUrl);
  
  // initialize transaction pool
  hermez.TxPool.initializeTransactionPool();

  // initialize exchange and user ETH accounts
  const exchangePrivKey = "0x7195775370d106ae8069783319ae787582eea525e0bb633ea5c014bf0099d5a2"
  const userPrivKey = "0x32ec5863a605bb99f9676d624499220029e5c4d9ccf07113801dfd4f71692610"

  // load token to deposit information
  const tokenIndex = 0;
  const token = await hermez.CoordinatorAPI.getTokens();
  const tokenERC20 = token.tokens[tokenIndex];

  // load first account
  const wallet = await hermez.HermezWallet.createWalletFromEtherAccount(hermezConfig.ethNodeUrl, { type: "WALLET", privateKey: exchangePrivKey });
  const hermezExchangeWallet = wallet.hermezWallet;
  const hermezExchangeEthereumAddress = wallet.hermezEthereumAddress;

  // load second account
  const wallet2 = await hermez.HermezWallet.createWalletFromEtherAccount(hermezConfig.ethNodeUrl, { type: "WALLET", privateKey: userPrivKey });
  const hermezUserWallet = wallet2.hermezWallet;
  const hermezUserEthereumAddress = wallet2.hermezEthereumAddress;

  // set amount to deposit
  const amountDeposit = hermez.Utils.getTokenAmountBigInt("100.0", 18);
  const compressedDepositAmount = hermez.HermezCompressedAmount.compressAmount(amountDeposit);

  // perform deposit hermezExchangeAccount
  await hermez.Tx.deposit(
    compressedDepositAmount,
    hermezExchangeEthereumAddress,
    tokenERC20,
    hermezExchangeWallet.publicKeyCompressedHex,
    { type: "WALLET", privateKey: exchangePrivKey }
  );

  // perform deposit hermezUserAccount
  await hermez.Tx.deposit(
    compressedDepositAmount,
    hermezUserEthereumAddress,
    tokenERC20,
    hermezUserWallet.publicKeyCompressedHex,
    { type: "WALLET", privateKey: userPrivKey }
  );

  // WAIT until accounts are created
  const pollingAccountCreate = true;
  while (pollingAccountCreate){
    const accountExchangeInfo = await hermez.CoordinatorAPI.getAccounts(hermezExchangeEthereumAddress, [tokenERC20.id]);
    if (accountExchangeInfo.accounts.length === 0){
      console.log("Waiting for deposits to be forged...");
      await sleep(10000);
    } else {
      break;
    }

  const infoAccountExchange = (await hermez.CoordinatorAPI.getAccounts(hermezExchangeWallet.hermezEthereumAddress, [tokenERC20.id]))
    .accounts[0];
  
  // EXCHANGE ACTION
  // create new bjj private key to receive user transactions
  const pvtBjjKey = Buffer.allocUnsafe(32).fill("1");

  // create rollup internal account from bjj private key
  const resExchangeWallet = await hermez.HermezWallet.createWalletFromBjjPvtKey(pvtBjjKey);
  const hermezExchangeUserWallet = resExchangeWallet.hermezWallet;

  // share public bjj key with the user
  console.log(`Transfer funds to this hermez address:\n   ${hermezExchangeUserWallet.publicKeyBase64}\n\n`);

  // USER ACTION
  // - the following code could be done through the web wallet provided by hermez network
  // - it is assumed that the user has already ether in hermez network
  
  const infoAccountUser = (await hermez.CoordinatorAPI.getAccounts(hermezUserWallet.hermezEthereumAddress, [tokenERC20.id]))
    .accounts[0];

  const state = await hermez.CoordinatorAPI.getState();
  const usdTokenExchangeRate = tokenERC20.USD;
  const fee = usdTokenExchangeRate ? state.recommendedFee.createAccountInternal / usdTokenExchangeRate : 0;

  // user creates transaction to deposit 10 ether into exchange account
  // deposit 10 ether
  const userDepositToExchange = hermez.Utils.getTokenAmountBigInt("10.0", 18);
  const compressedUserDepositToExchange = hermez.HermezCompressedAmount.compressAmount(userDepositToExchange);
  // the following transaction would:
  // - create an account for the exchange in hermez network
  // - transfer to exchange account 0.1 eth
  const transferToExchange = {
    from: infoAccountUser.accountIndex,
    to: hermezExchangeUserWallet.publicKeyBase64,
    amount: compressedUserDepositToExchange,
    fee : fee
  };
  console.log("transferToExchange: ", transferToExchange, fee);
  // send tx to hermez network
  await hermez.Tx.generateAndSendL2Tx(transferToExchange, hermezUserWallet, tokenERC20);

  // EXCHANGE ACTION
  // polling exchange account to check deposit from user is received
  const pollingExchangeAddr = true;
  while (pollingExchangeAddr){
    const accountExchangeInfo = await hermez.CoordinatorAPI.getAccounts(hermezExchangeUserWallet.publicKeyBase64, [tokenERC20.id]);
    if (accountExchangeInfo.accounts.length === 0){
      console.log("Waiting for user deposit to be forged...");
      await sleep(10000);
    } else {
      console.log("<=== Received deposit from user ===>");
      console.log(`accountExchangeInfo:\n ${accountExchangeInfo.accounts[0]}`);
      break;
    }
  }

  const infoAccountExchangeUser = (await hermez.CoordinatorAPI.getAccounts(hermezExchangeUserWallet.publicKeyBase64, [tokenERC20.id]))
   .accounts[0];

  // Transfer funds to main exchange account

  // generate L2 transaction
  const l2TxTransfer = {
    from: infoAccountExchangeUser.accountIndex,
    to:  infoAccountExchange.accountIndex,
    amount: compressedUserDepositToExchange,
    fee: fee
  };

  const transferResponse = await hermez.Tx.generateAndSendL2Tx(l2TxTransfer, hermezExchangeUserWallet, accountExchangeInfo.token).catch(console.log);
  console.log("transferResponse: ", transferResponse);
}

main();
```
