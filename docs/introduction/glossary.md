
# Glossary

#### Accounts

##### Regular Rollup Accounts
????

##### Internal Rollup Accounts
Account operational for L2 transactions only. 

#### BabyJubJub

BabyJubJub is an elliptic curve defined over a large prime field. It's useful in zk-SNARKs proofs.

####  Batch

A batch is a rollup block. It is formed by a set of transactions that determines a state transition of the Hermez accounts and sets an exit tree. Batches can be:
- L2-Batch: The set of transactions are only L2
- L1-L2 Batch: The set of transactions are L1 or L2

####  Coordinator

A coordinator is our term for rollup block producer. At any one time there is one coordinator responsible for collecting transactions and creating blocks on the rollup chain.

####  Forging

Forging refers to the creation of a batch of layer 2 transactions (off-chain), creation of the proof and the subsequent (on-chain) verification of the attached zk-SNARK.

#### Governance

#### Proof of donation

Bidding mechanism to select the coordinator for upcoming batches. A fraction of the winning bid goes back to be reinvested in the protocols and services that run on top of Ethereum. Check [Proof of donation](https://hermez.gitbook.io/tempdoc/#/introduction/pod) for more details.

#### zk-rollup

Check [what-is-a-zk-rollup](https://hermez.gitbook.io/tempdoc/#/introduction/overview?id=what-is-a-zk-rollup)


#### zk-SNARK

A zk-SNARK is a short (and efficiently checkable) cryptographic proof that allow us to prove something specific without revealing any extra information.

#### Transactions

TODO

##### Atomic Transactions

#### Trees
Each batch has an associated exit tree with all the exits performed by the user, either L1 or L2 exit transactions.
The exit tree has the same leaf structure as the state tree with some particularities:
- nonce is always set to 0
- if several exits are done in the same batch for the same account, the balance is just added on top of the account

User will need to prove that it owns a leaf in the exit tree in order to perform its withdraw and get back the tokens from the contract. This verification could be done either by submitting a merkle tree proof or by submitting a zkProof.


##### State Tree
Sparse merkle tree is used to represent the whole zkRollup state which is identified by its root. 
Each leaf of the state tree represents an account and contains data such us balance, ethereum Address or type of token stored in this account.


##### Exit Tree
