# REST API

> Please note that the REST API is still under development. It is described in this document as an orientation of what it will look like.

The API is the layer that allows 3rd party apps and services to interface with the coordinator to explore, monitor and use the Hermez rollup.
Example of these apps include:
* Wallet: send L2 transactions, check balance, ...
* Explorer: List transactions, slots, batches, ...
* Exchange integrations


The API end points are divided in three main groups:
1. **Account**: Provides information about accounts.
2. **Transaction**: Provides information about L2 transactions or sends transactions to a coordinator node.
3. **Hermez Status**: Provides information about operators, tokens, auctions,...

    
## Pagination
    
### Usage

All the endpoints that return a list of undefined size use pagination. 
In order to use pagination, three query parameters are used:
* `fromItem`: indicates the first item to be returned. In general, this parameter shouldn't be provided in the first call to the endpoint, and use the `itemId` of the last returned item (+/-) 1, if the order is (ascending/descending).
* `order`: all pginated items are ordered chronologicaly. However the specific fields to guarantee this order depend on each endpoint. For this purpose, `itemId` is used (itemId follows ascending chronological order except for unforged L1 user transactions). If the parameter is not provided, ascending order will be used by default. 
* `limit`: maximum amount of items to include in each response. Default is 20, maximum 2049.
    
Responses for those endpoints will always include a `pagination` object. This object includes the total amount of items that the endpoint will return at a given time with the given filters. Apart from that, it also includes the `itemId` of the last and first items that will be returned (not in a single response but within the total items). These two properties can be used to know when to stop querying. 

### Reorgs and Safety

Since all the items follow a chronological order, there are no safety problems when fetching items in ascending order (except for reorgs).

When fetching items descending order, new items will be added at the beginning. This doesn't cause any safety problems. In this case it is necessary to start queryng without the `fromItem` set to `pagination.lastItem`.

`itemId` can be used during reorgs. This is important since other identifiers may be the same but with different content. As an example, if the batch 424 get's reorged, it will be deleted. Eventualy, a new batch 424 will appear with potentialy different content.

## Account Endpoints
### POST /account-creation-authorization
Send an authorization to create rollup accounts associated to an Ethereum address. Each account creation (an account can only hold a specific token) is effective once the coordinator forges the corresponding L1CoordinatorTx.

### GET /account-creation-authorization/{hezEthereumAddress}
True if the coordinator has the required authorization to perform an account creation with the given Ethereum address on behalf of the Ethereum address holder.

### GET /accounts
Get accounts balances and other associated information.

### GET /accounts/{accountIndex}
Get account information by its index.

### GET /exits
Get exit information. 

### GET /exits/{batchNum}/{accountIndex}
Get exit information for a specific exit tree and account. This information is required to perform a withdraw. Exits are identified with accounIndex and batchNum since every batch that has exits has a different exit tree.

## Transaction Endpoints
### POST /transactions-pool
Send L2 transaction. The transaction will be stored in the transaction pool of the coordinator and eventually forged.

### GET /transactions-pool/{id}
Get transaction from the pool by its id. This endpoint is specially useful for tracking the status of a transaction that may not be forged yet.
Only transactions from the pool will be returned.
Note that the transaction pool is different for each coordinator and therefore only a coordinator that has received a specific transaction
will be able to provide information about that transaction.

### GET /transactions-history
Get historical transactions. This endpoint will return all the different types of transactions except for:
- Transactions that are still in the transaction pool of any coordinator. These transactions can be fetched using `GET /transactions-pool/{id}`.
- L1 transactions sent by users that have not been forged yet. These transactions can be fetched using `GET /transactions-history/{id}`.

### GET /transactions-history/{id}
Get transaction from the history by its id. This endpoint will return all the different types of transactions except those that are still in the pool of any coordinator.

## Hermez Status Endpoints
### GET /batches/{batchNum}
Get information on a specific batch.

### GET /full-batches/{batchNum}
Get information on a specific batch, including the associated transactions. The object returned in this method can be a bit heavy. 
If you're devloping a front end, you may consider using a combinaton of `GET /batches/{batchnum}` and `GET /history-transactions?batchNum={batchNum}`.

### GET /slots
Get information about slots.

### GET /slots/{slotNum}
Get information about a specific slot.

### GET /bids
Get a list of bids made for a specific slot auction.

### GET /state
Return information that represents the current state of the network. It also includes metrics and statistics.

### GET /config
Return constant configuration of the network.

### GET /tokens
Get information of the supported tokens in the Hermez network.

### GET /tokens/{id}
Get information of a token supported by Hermez network.

### GET /coordinators
Get information about coordinators.

### GET /coordinators/{bidderAddr}
Get the information of a coordinator.


