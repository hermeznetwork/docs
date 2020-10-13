# Attack analysis
This document aims to summarize all attacks vectors that could be performed to hermez protocol. Besides, an explanation of how to mitigate each attack vector is attached and why it could not be bypassed.

## Root state transition not valid
### Explanation
  - state tree keeps track of all deposits, transfers between accounts and withdrawals on L2. For whatever reason, a coordinator manages to forge a batch with an invalid state transition. 
  - this implies one of the following scenarios:
    - bug on zkSnark circuit
    - poseidon hash is broken
    - invalid proof hash been verified correctly

### Mitigation
  - [withdrawal delayed mechanism](/spec/withdrawaldelayer/withdrawaldelayer) has been implemented in order to manage this attack. This attack is understood as high risk attack were the funds could be stolen by a malicious party
  - proper monitoring tools will be used to detect it

### Could not be bypassed
  - `hermezKeeperAddress` will trigger to enter in `EMERGENCY_MODE`
  - `EMERGENCY_MODE` cannot be reverted
  - `governanceDAO` will decide how to withdraw the funds
    - if no decision is taken from `governanceDAO`, `whiteHackGroupAddress` has control over the funds

## DoS coordinator forging batches
### Explanation
  - coordinator [is forced to process L1 transactions](spec/zkrollup/protocol?id=l1-user-transactions) with a given set of parameters. At the same time, coordinator must accomplish zkSnark rules to verify the proof. At some point, a coordinator must submitt a proof with some forced parameters where the proof generated is not valid. Therefore, no coordinator could forge any valid proof.

### Mitigation
  - upgradeability of the zkSnark circuit fixing the bug
  - upgradeability is accomplished by the `governanceDAO`

### Could not be bypassed
  - rollup will be idle until the bug is fixed 
  
## DoS on L2 tx
### Explanation
  - all coordinators are not adding L2 transaction for a specific user denying any interaction with its account in L2

### Mitigation
  - protocol forces coordinator to add L1 transactions which could be understood as forced L2 transaction. Therefore, coordinator could not deny any L1 transactions despite the user source

### Could not be bypassed
  - parameters used in L1 transactions are forced by the smart contract. Hence, the coordinator must use those parameters, otherwise the proof will not be valid
  - If the coordinator refuse to forge more batches, user itself could reconstruct the state tree and forge himself his transaction

## DoS on L1 tx
### Explanation
  - coordinator could deny L1 transaction to users by filling L1 transactions by itself on every ethereum block

### Mitigation
  - since L1 transactions are queued in contract, any L1 transaction must be processed at some point. L1 transactions could be delayed by performing this attack type but it will mean that coordinator will fill batches with `maxL1Tx` continously

### Could not be bypassed
  - L1 transactions must be processed with a maximim delay of `forgeL1L2BatchTimeout`
  - this parameter could be change by the `governanceDAO` and coud not be greater than  240 blocks

## Idle rollup by not forging batches
### Explanation
  - coordinator could buy a bunch of slots in the auction and could decide not forge any batch during its slot time. This situation will idle the entire rollup system

### Mitigation
  - given that the slot time `BLOCKS_PER_SLOT` is 40 blocks, it is specified a deadline `_slotDeadline` where if the winner of the slot has not been forged, [anyone could forge](/spec/consensus/protocol?id=free-coordinator-override).

### Could not be bypassed
  - `_slotDeadline` could be modified by the `governanceDAO` and must be less than `BLOCKS_PER_SLOT`
  - There is always space inside a slot where anyone can forge a batch if winner coordinator has not been forged

## Idle rollup by forging empty batches
### Explanation
  - coordinator could buy a bunch of slots and just forge an empty batch with no L2 transactions to deny L2 transactions to users

### Mitigation
  - users can still use L1 transactions which will be forged. Still, L2 transaction will be denied. A mechanism to set a minimal bid for each slot has been implemented in order to prevent a coordinator to buy a bunch of slots an perform this attack

### Could not be bypassed
  - [Slots are splitted in a group of 6 slots](/spec/consensus/README?id=auction) an each one has a minimal bidding 
  - `governanceDAO` could change these minimal biddings
  - minimal bidding could be set too high preventing anyone to buy slot. Therefore, `bootCoordinaotr` controlled by hermez could forge batches or `_slotdeadline` could be reached and anyone could forge a batch

## Coordinator to create multiple accounts
### Explanation
  - coordinator could create a bunch of accounts for the same ethereum address A. User with ethereum address A will have several idxs to send/receive funds. Issue raises when [transaction to ethereum address](spec/zkrollup/protocol?id=transfertoethaddr) or [transaction to babyjubjub address](spec/zkrollup/protocol?id=transfertobjj) is used since coordinator could choose any idxs that matches ethereum address A or babyjubjub A
  - coordinator could decide to split transactions to several idxs. Thus, if user wants to do exit at some point, it will have the funds splitted into different accounts

### Mitigation
  - users may trust a coordinator to always send funds to the same idx
  - user trust coordinator to query idxs for pair
      - ethereum address A # tokenID
      - babyjubjub A # tokenID 

### Could not be bypassed since
  - user could build the full state tree from data-availability and query it to decide himself which idx to use without any dependency on the coordinator
