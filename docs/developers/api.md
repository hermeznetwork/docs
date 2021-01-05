# REST API


The API is the layer that allows 3rd party apps and services to interface with the coordinator to explore, monitor and use the Hermez rollup.
Example of these apps include:
* Wallet: send L2 transactions, check balance, ...
* Explorer: List transactions, slots, batches, ...
* Exchange integrations


The documentation of the API can be found [here](http://167.71.59.190:8001/)

In this section we will briefly outline the type of operations that can be performed with the API. In-depth information can be found in the link above.

The API endpoints are divided in three main groups:
1. **Account**: Provides information about accounts.
2. **Transaction**: Provides information about L2 transactions or sends transactions to a coordinator node.
3. **Hermez Status**: Provides information about operators, tokens, auctions,...


## Account
This group of endpoints provides `account` and `exits` related information.

There are two sets of `account` operations that can be performed:
- Retrieving information from existing accounts, using `/accounts` endpoints.
- Retrieving/configuring account authorizations using `/account-creation-authorization` endpoints. It is possible that a user authorizes the Coordinator the creation of an account with an Ethereum address using `POST /account-creation-authorization` endpoint. Then, the Coodinator will create the account at the moment this account receives a `Transfer`.

Additionally, `exit` endpoints collect information necessary to perform a `Withdrawal` (such as the `balance`, the `siblings` and the `batch number`).

## Transaction
This group of endpoints provides `transaction` related information from the different databases. `Pool` database gathers all L2 transactions collected by a coordinator that are pending to be forged. `History` database gathers all (L1 and L2) forged transactions. 

## Status
This group of endpoints provides general information such as:
- Batch information
- Slot information, including best bid information.
- Bidding information 
- State information, including `lastBatch`, `currentSlot`, `metrics`...
- Config information, including smart contract addresses, and other network parameters.
- Registered token information
- Available coordinator information

