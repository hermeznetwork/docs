# FAQ

## How to select a coordinator?
At the beginning we expect only a single coordinator working (boot coordinator). Both HermezJS and the wallet we provide to interact with Hermez will connect to this boot coordinator by default. As the network matures and different coordinators come online, one can check their status by using the provided REST API.

## How many coordinators will there be?

There is no limit to the number of coordinators. Becoming a coordinator is entirely permissionless and it will be enabled from the time of launch.

Although the first coordinator will be the Hermez Boot coordinator, which will forge blocks when there's no alternative bids in the auction, it is important for us that the market for coordinators becomes open over time.

## Will there be a competitive market for coordinators?

We are committed to creating a competitive market for coordinators and we will open source software to allow anyone to run a coordinator.

## How do I become a coordinator?

To become a coordinator you need to prepare the system infrastructure and take part in an auction and win a bid for a time slot.

## How long are coordinator time slots?

Slots will be 40 Ethereum blocks long (10 minutes).

## What happens if the coordinator goes offline?

If the coordinator has not done anything in the first part a slot (TBD), then anyone can jump in and replace it by forging blocks (first come first served).

The information stored on-chain (as part of [calldata](https://ethereum.stackexchange.com/a/52992)) is enough to allow anyone to independently build the full state tree (and become a coordinator themselves).

## How do coordinators make money?

They collect the transaction fees. They can expect a revenue per transaction and each coordinator will select to forge the more profitable transactions from the transaction pool.

They make benefit from this fees minus the operational costs and the bid price for the slot.

## How bids can be placed in the auction?

Coordinators will participate in the auction by sending an on-chain transaction to the auction smart contract.



## How exactly does proof-of-donation work?

We have an auction where everyone bids the amount of Hermez network tokens (HEZ) they're willing to donate in order to obtain the right to create the next block.

The winning bid is the highest amount of HEZ. And this address is assigned the right to create the next block.

We refer to this mechanism as **proof-of-donation** because **40%** of this bid goes back to be reinvested in the protocols and services that run on top of Ethereum.

For more on the details how it works, see this [ethresearch post](https://ethresear.ch/t/spam-resistant-block-creator-selection-via-burn-auction/5851) (though you should replace all instances of burn with donation when reading).

## Where are the funds from the proof-of-donation sent?

They will be sent initially to the Gitcoin quadratic funding pool, but with future governance, other funding pools might be enabled as they become
