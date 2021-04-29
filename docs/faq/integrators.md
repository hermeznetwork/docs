#  Integrators

This FAQ is addressed to developers integrating Hermez Network into their service, such es exchanges.

## Overview & Getting Started 

### Where do I start?

First plance to start is the [Developer Guide](../developers/dev-guide.md) that provides an introduction to Hermez and the protocol. Additionally, there are some 
code examples in the [SDK section](../developers/sdk.md) and in the [Exchanges section](../users/exchanges.md) that may be useful to get a deeper understanding of Hermez.

### Is there an SDK available?

HermezJS is an open-source SDK to interact with Hermez Rollup network.  It can be downloaded as an [npm package](https://www.npmjs.com/package/@hermeznetwork/hermezjs), or via [github](https://github.com/hermeznetwork/hermezjs). 
Additionally, there are some examples on how to interact with Hermez written in golang. You can find these examples [here](https://github.com/hermeznetwork/hermez-integration)

### What are the different account types in Hermez?

An account in Hermez is represented by a leave in the Merkle tree. Each account can only store one token type. There are two account types:
- Normal accounts include a hezEthereum and a Baby Jubjub address. These accounts can be used to do deposits from L1, transfers within L2 and withdraws to L1.
- Internal accounts include only a Baby Jubjub address. These accounts can be only be used to do transfers within L2.

### Is it possible to send a transfer to a non-existing Hermez account?

Yes, it is. The receiver of the transfer needs to have previously authorized the Coordinator to create the account at the moment of the transfer. This authorization is done by opening the account with the Hermez wallet.

### Do I need to run a Coordinator node?

You don't, unless you want to. However, as an integrator offering some service on top of Hermez Network you may want to spin a Hermez node in synchronizer mode to access
the Hermez data directly without any intermediary. 

### How do I check the status of a transaction?

Whenever you send a L2 transaction to Hermez, it will be added to a transaction-pool queue. This transaction will remain there until it has been processed or expired. The possible states of a transaction in the 
transaction pool include `forged`, `forging`, `pending` and `invalid`.To check the status of a transaction, you can query the API using the returned transaction id by seding a GET /transactions-pool/{transaction-id}. 

### What happens if a transaction is not processed?

Coordinators select the transactions to process according to some internal rules configured by the Coordinator. If the transaction is not processed, it will expire and be removed from the transaction pool.


### What is the timeout for a transaction in the transaction pool?

Currently, this timeout is set to 24 hours.

### Why a transaction may not be processed?

A valid transaction should always be processed within 15 minutes. Reasons why a transaction may be invalid and not processed by any Coordinator include insufficient balance in the sender account, unexisting sender account,
destination account hasn't given permission to create account, fees lower than suggested Coordinator fees,... Checking the transaction status will provide some feedback on the reason why the transaction wasn't forged.

### Can I cancel a transction in the pool?

Transactions cannot be cancelled once submitted. 

## Troubleshooting 

### Where can I submit a bug report or need help?

As always, please report bugs to hello@hermez.network. Also, you can always contact us in [Discord](https://bit.ly/hermez-discord)

