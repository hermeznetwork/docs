# Glossary

## BabyJubJub
BabyJubJub is an elliptic curve defined over a large prime field. It's useful in zk-SNARKs proofs.

##  Batch
A batch is a rollup block. It is formed by a set of transactions that determines a state transition of the Hermez accounts and sets an exit tree. Batches can be:
- L2-Batch: The set of transactions are only L2
- L1-L2 Batch: The set of transactions are L1 or L2

##  Coordinator
A coordinator is our term for rollup block producer. At any one time there is one coordinator responsible for collecting transactions and creating blocks on the rollup chain.

## Data Availability

##  Forging
Forging refers to the creation of a batch of layer 2 transactions (off-chain), creation of the proof and the subsequent (on-chain) verification of the attached zk-SNARK.

## Governance
The Hermez network community intends to follow a strategy of “Governance minimization”. This model is intended to be a initially a bootstrap governance mechanism to adjust and manage some network parameters mainly for security and stability purposes until the network reaches enough a degree of maturity to become fully decentralized; at that stage the initial bootstrap Governance model will no longer be necessary and will eventually disappear.

The network will start with a governance based on a Community Council formed by some distributed and known Ethereum community members. This council will delegate some specific network parameters adjustments into a reduced Bootstrap Council, which is non custodial,  in order to be more operationally effective in the initial phase.

In case that the protocol or the network needs for further and continued specific parameters governance after the initial bootstrap period (est. 1-2 years), a HermezDAO based on Aragon will be deployed and the weight of the voting will be based on HEZ staking calculated from snapshots.

Some decisions that the initial Community Council will be able to make will be:

- Governance and policies related changes
- Upgrade, maintenance and updates of the smart contracts code and/or circuits.

The bootstrap Council will be enabled to change some of the initial parameters of the Hermez smart contracts such as:

- Minimum bidding amount for the slots auction series;
- Days an auction is open for and slots before closing auction;
- Value of the outbidding variable;
- Boot Coordinator maximum cap reward reduction.

## HEZ

## Proof of donation
Bidding mechanism to select the coordinator for upcoming batches. A fraction of the winning bid goes back to be reinvested in the protocols and services that run on top of Ethereum. 

## Transactions
Transactions is the generic name given to every operation in the Hermez network. Transactions may be initiated by a user or by the coordinator. Transactions may also happen at L1 or L2. The coordinator node is in charge to collecting and processing transactions in batches generating a zk-SNARK to proofs that transactions have been carried out according to some rules.

### L1 Transactions
L1 transactions are those that are executed through the smart contract and affect the L2 state tree. These transactions may be started by the user or by the coordinator.

### L2 Transactions
L2 transactions are those that are executed exclusively on L2 and affect the L2 state tree.

### Atomic Transactions
Hermez provides the capability to for that some transaction are processed together. This feature is called Atomic Transctions.

## Trees
Hermez uses Sparse Merkle Trees to store the state of the Hermez network. There are two main tree structures:
- State Tree
- Exit Tree

### State Tree
Merkle tree used to represent the whole zkRollup state which is identified by its root. 
Each leaf of the state tree represents an account and contains data such us balance, ethereum Address or type of token stored in this account.
Thee root node is called the state root, and it summarized the state of the complete Hermez network.

### Exit Tree
Each batch has an associated exit tree with all the exits performed by the user, either L1 or L2 exit transactions. 

User will need to prove that it owns a leaf in the exit tree in order to perform its withdrawal and get back the tokens from the contract. This verification could be done either by submitting a merkle tree proof or by submitting a zkProof.
Thee root node is called the exit root, and it summarizes the state of the Exit Tree.


## zk-rollup
A zk-rollup is a layer 2 construction  which uses the Ethereum blockchain for data storage instead of computation. 
All funds are held by a smart contract on the main-chain. For every batch, a zk-snark is generated off-chain and verified by this contract.
This snark proves the validity of every transaction in the batch.

## zk-SNARK
A zk-SNARK is a short (and efficiently checkable) cryptographic proof that allows to prove something specific without revealing any extra information.

