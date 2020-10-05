# SDK
There is a SDK as part of the developer package containing useful functions to interact with Hermez network. 

The SDK can be found [here](xxxxxxx). 

## Wallet 

Wallet allows the user to interact with Hermez network. Wallet has an associated ethereum address/account and a pair of public/private keys that allow the wallet to sign transactions demonstrating ownership of the account (all Hermez transactions need to be signed).

The Wallet is represented by a javscript class exporting two methods.


```

/**
 * Manage Babyjubjub keys
 * Perform standard wallet actions
 */
export class BabyJubWallet {
  /**
     * Initialize Babyjubjub wallet from private key
     * @param {Buffer} privateKey - 32 bytes buffer
     * @param {String} hermezEthereumAddress - Hexadecimal string containing the public Ethereum key from Metamask
     */
  constructor (privateKey, hermezEthereumAddress) {
     ...
  }

  /**
     * Signs message with private key
     * @param {String} messageStr - message to sign
     * @returns {String} - signature packed and encoded as an hex string
     */
  signMessage (messageStr) {
     ...
  }

  /**
   * To sign transaction 
   * @param {Object} tx -transaction
   */
  signRollupTx (tx) {
    ...
  }
}

``` 


With the wallet create, user can now interact with the coordinator or send transactions to the smart contracts.

## Interaction with Coordinator via REST API
The coordinator can be reached via a [REST API](../integration/api). The SDK exports serveral methods to interact with the coordinator via REST API.


``` 
import axios from 'axios'
import { extractJSON } from '../utils/http'

const baseApiUrl = '167.71.59.190:8001'

/** GET /accounts
 */
async function getAccounts (hermezEthereumAddress) {
   ...
}

/** GET /accounts/{accountIndex}
 */
async function getAccount (accountIndex) {
   ...
}


/** GET /transaction-history
 */
async function getTransactions (accountIndex) {
  ...
}

/** GET /transactions-history/{transactionId}
 */
async function getHistoryTransaction (transactionId) {
  ...
}

/** GET /transactions-pool/{transactionId}
 */
async function getPoolTransaction (transactionId) {
  ...
}

/** GET /tokens
 */
async function getTokens (tokenIds) {
  ...
}

/** GET /tokens/{tokensIds}
 */
async function getTokens (tokenIds) {
  ...
}

/** GET /recommended-fee
 */
async function getFees () {
  ...
}

```
## L1 Transactions



## L2 Transactions


## Other Utility Functions



