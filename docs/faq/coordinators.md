#  Coordinators

A coordinator is our term for rollup block producer. At any one time there is one coordinator responsible for creating blocks on the rollup chain.
> Hermez is currently under development. Some of the details in the answers can be modified before network launch.

## How many coordinators will there be?

There is no limit to the number of coordinators. Becoming a coordinator is entirely permissionless and it will be enabled since the launch.

Although the first coordinator will be the Hermez Boot coordinator which will forge blocks when there's no alternative bids in the auction, it’s important for us that the market for coordinators becomes open over time.

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

