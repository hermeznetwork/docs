# SDK
HermezJS is an open-source SDK to interact with Hermez Rollup network.  It can be downloaded as an [npm package](https://www.npmjs.com/package/@hermeznetwork/hermezjs), or via [github](https://github.com/hermeznetwork/hermezjs).

## SDK How-To
In this tutorial we will walk through the process of using the SDK to:
1. Creating a wallet
2. Making a deposit from Ethereum into the Hermez Network
3. Making transfers
4. Checking a transactions' status
5. Withdrawing funds back to Ethereum network.

## Install Hermezjs
```bash
npm i @hermeznetwork/hermezjs
```

## Import modules
Load hermezjs library

```js
import hermez from './src/index.js'
```

## Create Transaction Pool
Initialize the storage where user transactions are stored. This needs to be initialized at the start of your application.

```js
  hermez.txPool.initializeTransactionPool()
```

## Connect to Ethereum Network
Some of the operations in Hermez Network, such as sending L1 transactions, require interacting with smart contracts. It is thus necessary to initialize an Ethereum provider.
During this example, we have deployed the contracts in our local blockchain.

```js
  hermez.Providers.setProvider('http://localhost:8545')
```

## Check token exists in Hermez Network
Before being able to operate on the Hermez Network, we must ensure that the token we want to operate with is listed. For that we make a call to the Hermez Coordinator API that will list all available tokens. All tokens in Hermez Network must be ERC20. For the rest of the example, we will use one of the tokens that have been registered in the Hermez Network. In this example there are 4 tokens registered.

```js
  const token = await hermez.CoordinatorAPI.getTokens()
  console.log(token)
  const tokenERC20 = token.tokens[3]

>>>>
   {
      tokens: [
        {
          itemId: 1,
          id: 0,
          ethereumBlockNum: 0,
          ethereumAddress: '0x0000000000000000000000000000000000000000',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          USD: null,
          fiatUpdate: null
        },
        {
          itemId: 2,
          id: 1,
          ethereumBlockNum: 37,
          ethereumAddress: '0x24650cad431915051e2987455b76e0cdcaa1d4d8',
          name: 'ERC20_0',
          symbol: '20_0',
          decimals: 18,
          USD: null,
          fiatUpdate: null
        },
        {
          itemId: 3,
          id: 2,
          ethereumBlockNum: 49,
          ethereumAddress: '0x715752d24f27224d4a88957896a141df87a50448',
          name: 'ERC20_1',
          symbol: '20_1',
          decimals: 18,
          USD: null,
          fiatUpdate: null
        },
        {
          itemId: 4,
          id: 3,
          ethereumBlockNum: 61,
          ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
          name: 'ERC20_2',
          symbol: '20_2',
          decimals: 18,
          USD: null,
          fiatUpdate: null
        }
      ]
   }

```

## Create a Wallet 
We can create a new Hermez wallet by providing the Ethereum account index associated with the provider initialized. This wallet will store the Ethereum and Baby JubJub keys for the Hermez account. The Ethereum address is used to authorize L1 transactions, and the Baby JubJub key is used to authorize L2 transactions. We will create two wallets.

```js
  // load ethereum network provider
  hermez.Providers.setProvider('http://localhost:8545')

  // initialize transaction pool
  hermez.TxPool.initializeTransactionPool()

  // load token to deposit information
  const tokenToDeposit = 3
  const token = await hermez.CoordinatorAPI.getTokens()
  const tokenERC20 = token.tokens[tokenToDeposit]

  // load first account
  const mnemonicIndex1 = 1
  const wallet = await hermez.HermezWallet.createWalletFromEtherAccount(mnemonicIndex1)
  const hermezWallet = wallet.hermezWallet
  const hermezEthereumAddress = wallet.hermezEthereumAddress

  // load second account
  const mnemonicIndex2 = 2
  const wallet2 = await hermez.HermezWallet.createWalletFromEtherAccount(mnemonicIndex2)
  const hermezWallet2 = wallet2.hermezWallet
  const hermezEthereumAddress2 = wallet2.hermezEthereumAddress

```


## Deposit Tokens from Ethereum into Hermez Network
Creating a Hermez account and depositing tokens is done simultaneously as an L1 transaction.  In this example we are going to deposit 100 `ERC20_2` tokens to the newly created Hermez account. The steps are:
1. Select amount to deposit from Ethereum into Hermez using `getTokenAmountBigInt()`
2. Select the token denomination of the deposit. 

```js
  // set amount to deposit
  const amountDeposit = hermez.Utils.getTokenAmountBigInt('100', 18)

  // perform deposit account 1
  await hermez.Tx.deposit(
    amountDeposit,
    hermezEthereumAddress,
    tokenERC20,
    hermezWallet.publicKeyCompressedHex
  )
```
Internally, the deposit funcion calls the Hermez smart contract to add the L1 transaction.

## Verify Balance
A token balance can be obtained by querying a Hermez node and passing the `hermezEthereumAddress` of the Hermez account.

```js
  // get sender account information
  const infoAccountSender = (await hermez.CoordinatorAPI.getAccounts(hermezEthereumAddress, [tokenERC20.id]))
    .accounts[0]

  // get receiver account information
  const infoAccountReceiver = (await hermez.CoordinatorAPI.getAccounts(hermezEthereumAddress2, [tokenERC20.id]))
    .accounts[0]

  console.log(infoAccountSender)
  console.log(infoAccountReceiver)

>>>>>
{
  accountIndex: 'hez:20_2:256',
  balance: '100000000000000000000',
  bjj: 'hez:1-WYg_cDxmLQPTxBDF2BdJYNsmK2KcaL6tcueTqWoQ6v',
  hezEthereumAddress: 'hez:0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  itemId: 1,
  nonce: 0,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  }
}
{
  accountIndex: 'hez:20_2:257',
  balance: '100000000000000000000',
  bjj: 'hez:_ayj1cwk6Kuch4oodEgYYTRWidBywlsV8cYlOyVPiZzl',
  hezEthereumAddress: 'hez:0x306469457266CBBe7c0505e8Aad358622235e768',
  itemId: 2,
  nonce: 0,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  }

```
We can see that the field `accountIndex` is formed by the token symbol it holds and an index. A Hermez account can only hold one type of token.
Account indexes start at 256. Indexes 0-255 are resered for internal use.

> Note that the `bjj` reported by some of the API endpoints is the same as the one included in the `Hermez Wallet` object, but they are represented in a different format.

Alternatively, an account query can be filtered using the `accountIndex`

```js
    const account1ByIdx = await hermez.CoordinatorAPI.getAccount(infoAccountSender.accountIndex)
    console.log(account1ByIdx)
    const account2ByIdx = await hermez.CoordinatorAPI.getAccount(infoAccountReceiver.accountIndex)
    console.log(account2ByIdx)

>>>>>

{
  accountIndex: 'hez:20_2:256',
  balance: '100000000000000000000',
  bjj: 'hez:1-WYg_cDxmLQPTxBDF2BdJYNsmK2KcaL6tcueTqWoQ6v',
  hezEthereumAddress: 'hez:0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  itemId: 1,
  nonce: 0,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  }
}
{
  accountIndex: 'hez:20_2:257',
  balance: '100000000000000000000',
  bjj: 'hez:_ayj1cwk6Kuch4oodEgYYTRWidBywlsV8cYlOyVPiZzl',
  hezEthereumAddress: 'hez:0x306469457266CBBe7c0505e8Aad358622235e768',
  itemId: 2,
  nonce: 0,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  }
}

```
### Exit

The `Exit` transaction is used as a first step to retrieve the funds from `Hermez Network` back to Ethereum.
There are two types of `Exit` transactions:
- Normal Exit, referred as `Exit` from now on. This is a L2 transaction type.
- `Force Exit`, an L1 transaction type which has extended guarantees that will be processed by the Coordinator. We will
talk more about `Force Exit` in the next sections.

The `Exit` is requested as follows:

```js
  // set amount to transfer
  const amountExit = hermez.Utils.getTokenAmountBigInt('12', 18)
  // set fee in transaction
  const userFee = 0

  // generate L2 transaction
  const l2ExitTx = {
    type: 'Exit',
    from: infoAccountSender.accountIndex,
    amount: amountExit,
    userFee
  }

  const exitResponse = await hermez.Tx.generateAndSendL2Tx(l2ExitTx, hermezWallet, infoAccountSender.token)
  console.log('exitResponse: ', exitResponse)

>>>>

exitResponse:  { status: 200, id: '0x020000000001000000000000', nonce: 0 }
```

After submitting our `Exit` request to the Coordinator, we can check the status of the transaction by calling
the Coordinator's Transaction Pool. The Coordinator's transaction pool stores all those transactions 
that are waiting to be forged.

```js
  const txPool = await hermez.CoordinatorAPI.getPoolTransaction(exitResponse.id)
  console.log(txPool)

>>>>>
{
  amount: '12000000000000000000',
  batchNum: null,
  fee: 1,
  fromAccountIndex: 'hez:20_2:256',
  fromBJJ: 'hez:1-WYg_cDxmLQPTxBDF2BdJYNsmK2KcaL6tcueTqWoQ6v',
  fromHezEthereumAddress: 'hez:0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  id: '0x020000000001000000000000',
  nonce: 0,
  requestAmount: null,
  requestFee: null,
  requestFromAccountIndex: null,
  requestNonce: null,
  requestToAccountIndex: null,
  requestToBJJ: null,
  requestToHezEthereumAddress: null,
  requestTokenId: null,
  signature: '43b0ce3153849490076fe77b8e51e7396d91d5e922adadd48723f50fce868c8b12677f88a9c3fded5226ae0d89ff8a7f982cc4e9ab8efe64fac55682f290df03',
  state: 'pend',
  timestamp: '2020-12-22T07:50:18.742049Z',
  toAccountIndex: 'hez:20_2:1',
  toBjj: null,
  toHezEthereumAddress: null,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  },
  type: 'Exit'
}

```
We can see the `state` field is set to `pend` (meaning pending). There are 4 possible states: 
1. **pend** : Pending
2. **fging** : Forging
3. **fged** : Forged
4. **invl** : Invalid

If we continue polling the Coordinator about the status of the transaction, the state will eventually be set to `fged`.


We can also query the Coordinator whether or not our transaction has been forged directly. `getHistoryTransaction` reports those transactions
that have been forged by the Coordinator.

```js
  const txExitConf = await hermez.CoordinatorAPI.getHistoryTransaction(txExitPool.id)
  console.log(txExitConf)

>>>>>>

{
  L1Info: null,
  L1orL2: 'L2',
  L2Info: { fee: 1, historicFeeUSD: null, nonce: 0 },
  amount: '12000000000000000000',
  batchNum: 163,
  fromAccountIndex: 'hez:20_2:256',
  fromBJJ: 'hez:1-WYg_cDxmLQPTxBDF2BdJYNsmK2KcaL6tcueTqWoQ6v',
  fromHezEthereumAddress: 'hez:0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  historicUSD: null,
  id: '0x020000000001000000000000',
  itemId: 5,
  position: 0,
  timestamp: '2020-12-21T11:19:04Z',
  toAccountIndex: 'hez:20_2:1',
  toBJJ: null,
  toHezEthereumAddress: null,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  },
  type: 'Exit'
}

```

And we can confirm our account status and check that the correct amount has been transfered out of the account.

```js
  console.log((await hermez.CoordinatorAPI.getAccounts(hermezEthereumAddress, [tokenERC20.id]))
    .accounts[0])

>>>>>

{
  accountIndex: 'hez:20_2:256',
  balance: '87999999999999999969',
  bjj: 'hez:1-WYg_cDxmLQPTxBDF2BdJYNsmK2KcaL6tcueTqWoQ6v',
  hezEthereumAddress: 'hez:0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  itemId: 1,
  nonce: 1,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  }
}

```

### Withdrawing Funds from Hermez

After doing any type of `Exit` transaction, which moves the user's funds from their token account to a specific Exit Merkle tree, one needs to do a `Withdraw` of those funds to an Ethereum L1 account.
To do a `Withdraw` we need to indicate the `accountIndex` that includes the Ethereum address where the funds will be transferred, the amount and type of tokens, and some information
to verify the ownership of those tokens. Additionally, there is one boolean flag. If set to true, the `Withdraw` will be instantaneous.

```js
  // get exit information
  const exitInfo = (await hermez.CoordinatorAPI.getExits(infoAccount.hezEthereumAddress, true)).exits[0]
  // set to perform instant withdraw
  const isInstant = true

  // perform withdraw
  await hermez.Tx.withdraw(
    exitInfo.balance,
    exitInfo.accountIndex,
    exitInfo.token,
    hermezWallet.publicKeyCompressedHex,
    exitInfo.batchNum,
    exitInfo.merkleProof.siblings,
    isInstant
  )
```


The funds should now appear in the Ethereum account that made the withdrawal.

## Transfer

First, we compute the fees for the transaction. For this we consult the recommended fees from the Coordinator.

```js
  // fee computation
  const state = await hermez.CoordinatorAPI.getState()
  console.log(state.recommendedFee)

>>>>
{
  existingAccount: 0.1,
  createAccount: 1.3,
  createAccountInternal: 0.5
}

```

The returned fees are the suggested fees for different transactions:
- existingAccount : Make a transfer to an existing account
- createAccount   : Make a transfer to a non-existent account, and create a regular account
- createAccountInternal : Make a transfer to an non-existent account and create internal account

The fee amounts are given in USD. However, fees are payed in the token of the transaction. So, we need to do a conversion.

```js
  const usdTokenExchangeRate = tokenERC20.USD
  const fee = fees.existingAccount / usdTokenExchangeRate
```

Finally we make the final transfer transaction.

```js
  // set amount to transfer
  const amountTransfer = hermez.Utils.getTokenAmountBigInt('3', 18)

  // generate L2 transaction
  const l2TxTransfer = {
    type: 'Transfer',
    from: infoAccountSender.accountIndex,
    to: infoAccountReceiver.accountIndex,
    amount: amountTransfer,
    userFee
  }

  const transferResponse = await hermez.Tx.generateAndSendL2Tx(l2TxTransfer, hermezWallet, infoAccountSender.token)
  console.log('transferResponse: ', transferResponse)
 
>>>>>

  { status: 200, id: '0x020000000001000000000001', nonce: 1 }

```
The result status 200 shows that transaction has been correctly received. Additionally, we receive the nonce matching the transaction we sent,
and an id that we can use to verify the status of the transaction.
As we saw with the `Exit` transaction, every transaction includes a ´nonce´. This `nonce` is a protection mechanism to avoid replay attacks. Every L2 transaction will increase the nonce by 1.

## Verifying Transaction Status
Transactions received by the Coordinator will be stored in its transaction pool while they haven't been processed. To check a transaction in the transaction pool we make a query to the Coordinator node.

```js
  const txXferPool = await hermez.CoordinatorAPI.getPoolTransaction(transferResponse.id)
  console.log(txXferPool)

>>>>>
{
  amount: '3000000000000000000',
  batchNum: null,
  fee: 1,
  fromAccountIndex: 'hez:20_2:256',
  fromBJJ: 'hez:1-WYg_cDxmLQPTxBDF2BdJYNsmK2KcaL6tcueTqWoQ6v',
  fromHezEthereumAddress: 'hez:0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  id: '0x020000000001000000000001',
  nonce: 1,
  requestAmount: null,
  requestFee: null,
  requestFromAccountIndex: null,
  requestNonce: null,
  requestToAccountIndex: null,
  requestToBJJ: null,
  requestToHezEthereumAddress: null,
  requestTokenId: null,
  signature: '7f8a4b7c73e0d7f31b0ed0585ec347f6f7878664c4aa15da40ecb58fdecf612585d52d369b0651b84177dddc97efc24cdd7292d77409f1a46ba2b8c768dc8205',
  state: 'pend',
  timestamp: '2020-12-22T08:02:57.781475Z',
  toAccountIndex: 'hez:20_2:257',
  toBjj: 'hez:_ayj1cwk6Kuch4oodEgYYTRWidBywlsV8cYlOyVPiZzl',
  toHezEthereumAddress: 'hez:0x306469457266CBBe7c0505e8Aad358622235e768',
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  },
  type: 'Transfer'
}

```

We can also check directly with the Coordinator in the database of forged transactions.

```js
  const transferConf = await hermez.CoordinatorAPI.getHistoryTransaction(transferResponsel.id)
  console.log(transferConf)

>>>>>

{
  L1Info: null,
  L1orL2: 'L2',
  L2Info: { fee: 1, historicFeeUSD: null, nonce: 1 },
  amount: '3000000000000000000',
  batchNum: 51,
  fromAccountIndex: 'hez:20_2:256',
  fromBJJ: 'hez:1-WYg_cDxmLQPTxBDF2BdJYNsmK2KcaL6tcueTqWoQ6v',
  fromHezEthereumAddress: 'hez:0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  historicUSD: null,
  id: '0x020000000001000000000001',
  itemId: 6,
  position: 0,
  timestamp: '2020-12-22T08:03:05Z',
  toAccountIndex: 'hez:20_2:257',
  toBJJ: 'hez:_ayj1cwk6Kuch4oodEgYYTRWidBywlsV8cYlOyVPiZzl',
  toHezEthereumAddress: 'hez:0x306469457266CBBe7c0505e8Aad358622235e768',
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  },
  type: 'Transfer'
}
```

At this point, the balances in both accounts will be updated with the result of the transfer

```js 

  console.log((await hermez.CoordinatorAPI.getAccounts(hermezEthereumAddress, [tokenERC20.id]))
  console.log((await hermez.CoordinatorAPI.getAccounts(hermezEthereumAddress2, [tokenERC20.id]))

>>>>>

{
  accountIndex: 'hez:20_2:256',
  balance: '84999999999999999962',
  bjj: 'hez:1-WYg_cDxmLQPTxBDF2BdJYNsmK2KcaL6tcueTqWoQ6v',
  hezEthereumAddress: 'hez:0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  itemId: 1,
  nonce: 2,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  }
}
{
  accountIndex: 'hez:20_2:257',
  balance: '103000000000000000000',
  bjj: 'hez:_ayj1cwk6Kuch4oodEgYYTRWidBywlsV8cYlOyVPiZzl',
  hezEthereumAddress: 'hez:0x306469457266CBBe7c0505e8Aad358622235e768',
  itemId: 2,
  nonce: 0,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  }
}

```
### Force Exit

This is the L1 equivalent of an Exit. With this option, the smart contract forces Coordinators to pick up these transactions before they pick up L2 transactions. Meaning that these transactions will always be picked up.

This is a security measure. We don't expect users to need to make a Force Exit.
An `Exit` transaction is the first of two transactions used to recover the tokens from Hermez Network to Ethereum. The second transaction is a `withdraw` wich we will see later on.

```js
  // set amount to force-exit
  const amountExit = hermez.Utils.getTokenAmountBigInt('8', 18)

  // perform force-exit
  await hermez.Tx.forceExit(amountExit, infoAccount.accountIndex, tokenERC20)
```

Once the transaction has been forged by a Coordinator, we can check the account status

```js
  console.log((await hermez.CoordinatorAPI.getAccounts(hermezEthereumAddress, [tokenERC20.id]))

>>>>>>

{
  accountIndex: 'hez:20_2:256',
  balance: '76999999999999999962',
  bjj: 'hez:1-WYg_cDxmLQPTxBDF2BdJYNsmK2KcaL6tcueTqWoQ6v',
  hezEthereumAddress: 'hez:0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  itemId: 1,
  nonce: 2,
  token: {
    USD: null,
    decimals: 18,
    ethereumAddress: '0x2e9f55f7266d8c7e07d359daba0e743e331b7a1a',
    ethereumBlockNum: 61,
    fiatUpdate: null,
    id: 3,
    itemId: 4,
    name: 'ERC20_2',
    symbol: '20_2'
  }
}
```

The last step to recover the funds will be to send a new `Withdraw` request to the Coordinator as we did after the regular `Exit` request.

```js 
  // get exit information
  const exitInfo = (await hermez.CoordinatorAPI.getExits(infoAccount.hezEthereumAddress, true)).exits[0]
  // set to perform instant withdraw
  const isInstant = true

  // perform withdraw
  await hermez.Tx.withdraw(
    exitInfo.balance,
    exitInfo.accountIndex,
    exitInfo.token,
    hermezWallet.publicKeyCompressedHex,
    exitInfo.batchNum,
    exitInfo.merkleProof.siblings,
    isInstant
  )

```
