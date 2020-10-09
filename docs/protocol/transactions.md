# Transactions
There are two type of Hermez transactions:
- **L1 transactions** are those that are executed through the smart contract and affect the L2 state tree. These transactions may be started by the user or by the coordinator.
- **L2 transactions** are those that are executed exclusively on L2 and affect the L2 state tree

## L1 Transactions
L1 transactions can be divided in two groups depending the originator of the transaction:
- **L1 User Transactions**: originate from an Hermez end user using some form of Wallet. 
- **L1 Coordinator Transactions**: originate from the coordinator.

### L1 User Transactions
L1 user transactions are concatenated to [`force the coordinator`](../protocol/forging?id=ensuring-l1-user-transactions-are-processed) to process them toguether as part of the same batch. These transactions have to comply with certain rules to be deemed valid by the coordinator. If any of those rules is not fulfilled the transaction will be considered as a NULL transaction.
When coordinator processes L1 transactions, it must process all of them at once (up to a maximum number specified by the smart contract). This rule has two effects:
- Coordinator cannot block particular users in L1.
- Coordinator cannot anticipate the computation of L1 transactions proofs because it needs to take all pending transactions up to the moment of forging (moment when smart contract is called). 

> If any user tries to flood L1 transactions with invalid transactions, it will have to pay fees associated to L1 transactions

Examples of L1 User transactions include `CreateAccountDeposit`, `Deposit`, `DepositTransfer`...

### L1 Coordinator Transactions
L1 Coordinator Transactions allow the cordinator to create accounts when forging a batch. This way, a user can transfer funds to another user that doesn't own an account yet.

## L2 Transactions
L2 transactions are exectuted exclusively on L2. Examples of L2 tranactions include `Transfer` of funds between rollup accounts or `Exit` to transfer funds to the exit tree. All L2 transactions are initiated by the user, who sends the transactions directly to the coordinator. Depending on the UI capabilities, the user may be able to select among different number of coordinators (the one currently forging, the ones that already have won the right to forge in upcoming slots,...).

### Fee Model
Fees are payed on L2 transactions in the same token used in the transaction. The coordinator collects these fees from up to 64 different tokens per batch. If more than 64 tokens are used in the same batch, no fees will be collected for the excess number of tokens. 


