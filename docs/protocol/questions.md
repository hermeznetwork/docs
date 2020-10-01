All questions relate to Hermez spec in idocs


1. **CreateAccountDepositFromRelayer**: ???? I don't understand the difference between this and the CreateAccountDepositFromRelayer. Is it that when the destination account does't exist, this function is called? ???

2. **ForceTransfer**:  ??? Why is it called ForceTransfer and not just Transfer (there is no transfer transactoin) ???

3. **ForceExit**: ??? Why forcexit an not just exit ???

4. ??? What is the difference between a regular rollup account and an internal rollup account????

5. ??? What is the relationship between internal and regular accounts/and L1 coordinator transactions createAccountEth and CreateAccountBjj. ????

6. **All L2 transactions are sent by the users to the coordinator** : how does the user know who the coordinator is?

7. **TransferToEthAddr and TransferToBjj** encourage the coordinator to create new accounts through L1 coordinator transactions. ??? Why and how is it encouraged ???

8. In order to force the coordinator to forge L1 transactions, but also allow him to parallelize his proof computation, (??? why does this mechanism allow parallelization. Does it mean that L2 transactions are not included in the proof ????) the contract establishes a deadline for the L1-L2-batches. Every L1-L2-batches forged resets this deadline. This mechanism is summarized in the diagram below.

9. Auction is structured in groups of **6 slots**, with **10 HEZ** as initial minimal bidding price for all the slots. (??? what does it mean structuredin goups of 6 slots? What is the purpose? Does it mean that a coordinator bids for 6 slots together? ???).

10. The governance can change this value of 6 slot groups independently at any time and **affecting open auctions**. (??? I thought all slots started with minimum bid, not just 0, 6, 12,.... ???).

11. When the coordinator of the current slot doesn't forge any batch in the N first available blocks inside the slot, any available coordinator may forge batches without bidding. (??? Can several coordinators forge simutaneously? How is everything synchornized???)


