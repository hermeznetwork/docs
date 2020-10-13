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
The coordinator can be reached via a [REST API](../integration/api). The SDK exports serveral methods to interact with the coordinator via REST API. Below you can find some examples on how to access some of the API endpoints. 


``` 
import axios from 'axios'
import { extractJSON } from '../utils/http'

const baseApiUrl = '167.71.59.190:8001'

/**
 * GET /accounts
 * @param {String} (hermezEthereumAddress) - 
 * @returns {String} - 
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

```
export const deposit = async (addressSC, loadAmount, tokenId, walletRollup, abi, gasLimit = 5000000, gasMultiplier = 1) => {
  ...
}

export const depositOnTop = async (addressSC, loadAmount, tokenId, babyjubTo, abi, gasLimit = 5000000, gasMultiplier = 1) => {
  ...
}

export const withdraw = async (addressSC, tokenId, walletRollup, abi, urlOperator,
  numExitRoot, gasLimit = 5000000, gasMultiplier = 1) => {
  ...
}

export const forceWithdraw = async (addressSC, tokenId, amount, walletRollup, abi,
  gasLimit = 5000000, gasMultiplier = 1) => {
  ...
}

```

## L2 Transactions

```
/**
 * send off-chain transaction
 * @param {String} urlOperator - url from operator
 * @param {String[2]} babyjubTo - babyjub public key receiver
 * @param {String} amount - amount to transfer
 * @param {Object} walletRollup - ethAddress and babyPubKey together
 * @param {Number} tokenId - token type identifier, the sender and the receive must use the same token
 * @param {String} fee - % of th amount that the user is willing to pay in fees
 * @param {String} nonce - hardcoded from user
 * @param {Object} nonceObject - stored object wich keep tracking of the last transaction nonce sent by the client
 * @param {String} ethAddress - Ethereum address enconded as hexadecimal string to be used in deposit off-chains
 * @returns {Object} - return a object with the response status, current batch, current nonce and nonceObject
*/
export async function send (urlOperator, babyjubTo, amount, walletRollup, tokenId, fee, nonce, nonceObject, ethAddress) {
...
}

```


## Other Utility Functions


/**
 * Get current average gas price from the last ethereum blocks and multiply it
 * @param {Number} multiplier - multiply the average gas price by this parameter
 * @param {Object} provider - ethereum provider object
 * @returns {Promise} - promise will return the gas price obtained.
*/
export async function getGasPrice (multiplier, provider) {

