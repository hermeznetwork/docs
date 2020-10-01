# Transactions
There are two type of Hermez `transactions`:
- L1 transactions are those that are executed through the smart contract and affect the L2 state tree. These transactions may be started by the user or by the coordinator.
- L2 transactions are those that are executed exclusively on L2 and affect the L2 state tree

## L1 Transactions
L1 transactions can be divided in two groups depending the originator of the transaction:
- **L1 User Transactions**: originate from an Hermez end user using some form of Wallet.
- **L1 Coordinator Transactions**: originate from the coordinator.

### L1 User Transactions
L1 user transactions are concatenated together and hashed to [force the coordinator]((https://hermez.gitbook.io/tempdoc/#/protocol/forgiing?id=forgin) to process them at some point.  These transactions have to comply with certain rules to be deemed valid by the coordinator. If any of those rules are not fulfilled the transaction will be considered as a NULL transaction.

> If any user tries to flood L1 transactions with invalid transactions, it will have to pay fees associated to L1 transactions

Examples of L1 User transactions include `CreateAccountDeposit`, `Transfer`, `Exit`...

### L1 Coordinator Transactions
L1 Coordinator Transactions allow the cordinator to create accounts when forging a batch. This way, a use can transfer funds to a person that doesn't own an account yet.

## L2 Transactions
L2 transactions are exectuted exclusively on L2. Examples of L2 tranactions incliude `Transfer` of funds between rollup accounts or `Exit` to trasfer funds to the `exit tree`. All L2 transactions are initiated by the user.

### Fee Model
Fees are payed on L2 transactions in the same token used for the transaction. Coordinator collects these fees from up to 64 different tokens per batch. If more than 64 tokens are used in the same batch, no fees will be collected for the excess number of tokens. The ZK-SNARK includes information about the collected fees.


