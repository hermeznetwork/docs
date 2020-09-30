# Hermez zkRollup protocol

In Hermez, all accounts and balances are stored in a state tree offchain (L2). Incomming user transactions are batched toguether, and through a zk-SNARKs proving that those transaction meet certain rules specified in a smart contract, the state tree transitions to a new valid state. The Coordinator is the entity that collects and codifies these transactions, calculates the ZKSNARKs proof and submits the result to the smart contract that will validate transition. All transactions are made public to provide data-availability to the protocol so that anyone can rebuild the L2 state from onchain (L1) data.

Add figure

Hermez functionalities can be summarized as:
- Handle L1-user transactions
- Forge batches:
    - Ask consensus algorithm for coordinator approval
    - Add L1 Coordinator transactions
    - Ensure that state transitions are valid via a ZKSNARK
    - Update state root and set exit root
- Allow Governance to modify certain rules defined in smart contracts
- Utility actions: such as withdraw funds or add new tokens on the rollup

Add figure SC

## Transactions
There are two type of transactions:
- L1 transactions are those that are executed through the smart contract and affect the L2 state tree. These transactions maybe started by the user or by the coordinator.
- L2 transactions are those that are executed exclusively on L2 and affect the L2 state tree

### L1 Transactions
#### L1 User Transactions

All L1 data transactions are concatenated together and hashed to force the coordinator to process them (??? How is it forced???).
These transactions have to accomplish certain rules to be processed by the circuit. If any of those rules are not fulfilled the transaction will be considered as a NULL transaction.
> If any user tries to flood L1 transactions with invalid transactions, it will have to pay fees associated to L1 transactions
All L1 txs that perform a transfer or exit must be approved by the ethereum address of the account.

CreateAccount actions must be authorized by the `fromEthAddr`.  To allow other parties to create accounts on behalf of the user, a special smart contract function (`CreateAccountDepositFromRelayer`) is added that requires the same signature authorization used in L1CoordinatorTxs to create regular accounts.

Internal rollup accounts do not have an ethereum address.  For this case, the `CreateAccountDepositFromRelayer` function can be called with a `AccountCreationAuthMsg = 0xffff..` and the account will be created with an `EthAddr = 0xffff..`.

- CreateAccountDeposit :
- CreateAccountDepositFromRelayer :
- CreateAccountDepositTransfer
- Deposit
- DepositTransfer
- ForceTransfer
- ForceExit


#### L1 Coordinator Transactions
Coordinator has the ability to create accounts at the time to forge a batch. 
Account could be created for a given:
- ethereum address - babyjubjub key pair (regular rollup account)
- babyjubjub public key (internal rollup account)

- CreateAccountEth
- CreateAccountBjj

### L2 Transactions
All L2 transactions are sent to the coordinators by the users. The coordinator collects them into a batch in order to forge it. 
The coordinator must check that it collects valid transactions that must not perform an invalid transition state. Otherwise, the proof computed by the coordinator will not be valid.
The user could submit any transaction data to the coordinator but it will be rejected if the transaction could not be processed. Therefore, it is on the user benefit to provide valid transaction if they want it to be inserted in the zkRollup.

Signature used for L2 transactions is `eddsa` with Babyjubjub key.
L2 transaction data in the signature:

- Transfer : Standard transaction of tokens between two accounts inside the rollup, L2 --> L2.  It is assumed that this transaction has a recipient `toIdx` > `INITIAL_IDX`
- Exit : Transfer tokens from an account to the [exit tree](/spec/zkrollup/protocol?id=exit-tree), L2 --> L2
- TransferToEthAddr : Sender sends the transaction to a ethereum address recipient in the state tree. 
If the recipient does not exist and coordinator wants to process the transaction, it should create a new account with the recipient ethereum address. 

It is assumed that the `toIdx` is set to the special index 0.
`toEthAddr` would be used to choose a recipient to transfer the `amountFloat16`. 
Hence, coordinator would select the recipient `idx` to add `amountFloat16` (called `auxToIdx`).

> Note that this transaction encourages the coordinator to create new accounts through L1 coordinator transaction [CreateAccountEth](#createaccounteth)
> It is important to mention that this kind on transactions allows the creation of new accounts in the state tree without the need of having any `ether` on L1. Hence, users could create new accounts and deposit tokens just through an L2 transaction. 

- TransferToBjj : Sender sends the transaction to a babyjubjub address recipient in the state tree. 
If the recipient does not exist and coordinator wants to process the transaction, it should create a new account with the recipient babyjubjub address.

It is assumed that the `toIdx` is set to the special index 0.
`toBjjAy` + `toBjjSign` would be used to choose the recipeint to transfer the `amountFloat16`.
`toEthAddr` will be set to `0xffff..` which is a special case of an ethereum address that no one can control.  This value allows account creation without ethereum address authorization.
Hence, coordinator would select the recipient `idx` to add `amountFloat16` (called `auxToIdx`).

> Note that this transaction encourage coordinador to create new accounts through L1 coordinator transaction [CreateAccountBjj](#createaccountbjj)
> It is important to mention that this kind on transactions allows the creation of new accounts in the state tree without the need of having any `ether` on L1. Hence, users could create new accounts and deposit tokens just through an L2 transaction. 

## Forging

The `forgeBatch` functionality depends on a consensus mechanism that decides the coordinator of a given batch implemented in a separate smart contract.
 During a forge call in the rollup smart contract, a coordinator calls the consensus smart contract to validate if it is allowed to forge, to update its state and to perform consensus actions if necessary.

If coordinator is approved a forge a batch, then it will add its [L1-coordinator-transactions](spec/zkrollup/decContracts?id=l1-coordinator-transactions) and will verify the circuit proof against the verifier smart contract as we can see in the previous [diagram](spec/zkrollup/decContracts?id=hermez-general-goals)


There are 2 kind of `forgeBatch`, a flag in the function will distinguish between them
- L2-batch
    - Forge only L2 transactions, L1 transactions are not mined, neither the users nor the coordinator
- L1-L2-batch
    - Forge both L1 and L2 transactions. The coordinator must forge all the L1 transactions in the first queue, wich is frozen (once a queue is frozen means that L1 transactions can't be added anymore)
    - Optionally coordinator can add [L1-coordinator-transactions](spec/zkrollup/decContracts?id=l1-coordinator-transactions)
    - Update state and set exit root
    - Delete current queue, freeze next one


In order to force the coordinator to forge the L1 transactions, but also allow him to parallelize his proof computation, the contract establish a deadline for the L1-L2-batches. Every L1-L2-batches reset the deadline, so, as shown in the diagram, the coordinator is free to choose to forge L2-batches or L1-L2-barches until the deadline, when only L1-L2-batches are accepted.

![](forgeL1L2.png)

- zkRollup is divided into slots of a certain duration:
  - Block ethereum = ~ 15s
  - Slot = 40 Ethereum Blocks = 40 \* 15s = 600s = 10 min
  - [Slot deadline](#free-coordinator-override) = _Pending to be defined_

![](consensus-1.png)

### Consensus
Hermez will run an auction in HEZ for every period of time (slot) where transactions can be forged. Bidding allows to select single coordinator to forge a batch in every slot, incentivise coordinator efficieny, and maintain the network running.


### Auction

Bids in the Auction will be placed only in HEZ. The auction of future slots will be open up to **1 month** (system parameter), the opening is a sliding window that opens a new slot every 40 blocks.

Auction will be closed **2 slots** (system parameter) before the begin time of the forging in the slot.

A bid will not pay premium on top of the previous bid, but a bid placed in the auction should be at least **1,1 times** (system parameter) the previous bid or over the minimal bidding price (if it's the first one) in order to be accepted as valid.

Auction will be structured in series of 6 slots `slots[5]`, with **10 HEZ** as initial minimal bidding price for all the slots. The governance can change this value `slots[i]` independently at any time and **affecting open auctions**, in such a way that all the slots whose `slot % 6 = i` will have the same minimum bid. Bids under the new minimal bidding price will not be considered as valid bids anymore and bidders (if no new bids outbid theirs) will be sent back their HEZ at the event of slot is fully processed (forge).

When a slot number in the series gets **0 HEZ value**, it will be locked and governance will not be able to modify the minimal bidding price anymore, so **it will become decentralized**.

![](consensus-2.png)

![](consensus-3.png)

### HEZ token bidding allocation

In the moment of placement, all bids in form of HEZ token placed in the auction will be stored in the smart contract, and will pay the gas to send the previous bidder their HEZ back.

Once the slot is forged, the tokens are assigned to **three** different accounts:

- A part of the tokens will be **burnt** using the ERC-777 Burn function. So they will not be at 0x0 address, but reduced from the total token amount.
- A part will be assigned to the **donations account**. Governance process will decide how to allocate this funds into different projects.
- The rest will be sent to the **Security Token Holders** (HGT). Governance process will also decide how to distribute and send this value to the HGT. We will start with one which will be send periodically the proportional part of the HEZ collected into this account to the same accounts that hold the HGT.

### Boot coordinator

This element has the mission to support the network bootstrap and at some moment will disappear if network gets traction. This event of the boot coordinator disappearing will be a governance decision.

Basically its role is to forge any slot where there are no winner in the auction without the need of make a bid.

### Free coordinator override

There is a situation where any coordinator can forge batches without bidding.

This happens when the coordinator of the current slot doesn't forge any batch in the N first available inside the slot.

This mechanism responds to the need of the network for the efficiency of coordinators, and cover from potential technical problems or attacks.

It also provides a guarantee to users that all funds will be recoverable from the L2 network because there is a deadline after which a batch MUST include L1 pending transactions, which includes L2 (funds) exit operations.


## Governance
Gvoernance is able to modify some of the parameters defined in the smart contracts, such as new token fees, L1 Tx fees, forgeL1.Timeout,...

## Utility Functions

### Add Tokens

Hermez contains a list with all the tokens supported. Tokens must be ERC20. Everyone can add a new token using utility functions by paying some fee in HEZ to the governance address

### Withdrawal

Funds are heald on Hermez smart contract once the use has performed an exit transaction. Withdrawal is the transaction to get froms from smart contract to ethereum address. It is done by proving the existence of a leaf in the exit tree. 

There is a limit on the amount that can be withdrawn at once as a prevention mechanism against trying to withdraw stolen funds. 

#### Hermez withdraw limit

There will be a histogram of maximum amount of withdrawals in a value range:
  - Limits the maximum amount to withdraw
  - Value range is set in USD
  - Buckets are filled in a blockRatio
  - If a withdraw reaches the histogram limit, an instant withdraw cannot be performed

Every time a user tries to perform an instant withdraw:
  - Updates the counter of the histogram
  - If the counter is above the capacity of that range, instant withdraw is reverted

![](buckets.png)

> Note that `withdraw limit` would be the maximum amount of tokens that an attacker can steal since the contract will return `revert` when the instant withdraw is called again and there are no tokens left to send.
> The histogram is understood as buckets.

#### Mechanism

The number of withdraws above the `withdraw limit` can not be withdrawn instantly, there will be a delay. Tokens will be sent to the `WithdrawalDelayer` smart contract.

Users will be able to perform instant withdrawals as long as `Hermez Contract` does not reach the `withdrawal limit`, that is, it runs out of withdraws available in the bucket (in the bucket with that price range).

Actions that will be taken if the `withdrawal limit` is reached are the following ones:

- If a user does an `instantWithdraw`, `Hermez Contract` will return `revert`.
- If a user does a `delayWithdraw`, it will be accepted and the tokens will be sent to `WithdrawalDelayer`. The user can withdraw their tokens but with a delay.

There will be a delay time `D` (parameter of the `WithdrawalDelayer` contract) during which the Hermez foundation can decide if there has been an attack or not:

- Not attack:
    - When enough blocks have passed for the bucket to refill, `Hermez Contract` will accept `instantWithdraw` again, while withdrawals are available in the bucket.

- Attack:
    - The histogram values will all be set to 0 (change to `SAFE_MODE`)  so that all tokens are sent to `WithdrawalDelayer` until the histogram values are changed again.

- If a decision is not made in the defined period:
    - When enough blocks have passed for the bucket to refill, `Hermez Contract` will accept `instantWithdraw` again.

![](emergency-mechanism.png)

> Hermez network foundation will be monitoring constantly the system in order to detect possible anomalies and to be able to decide as soon as possible if they are an attack.

