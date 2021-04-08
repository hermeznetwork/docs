# End users

> Hermez is currently under development. Some of the details in the answers can be modified before network launch.

## How much is a transaction expected to cost?

While we don't yet have an exact figure, our best estimate is that a normal transaction should cost on the order few dollar cents. The price will be determined by the coordinators but this price will depend amongst other on the L1 gas price and the operation costs of coordinators but we estimate a reduction around 95% of the current L1 transaction cost.

## Which tokens can I transact with?

While Hermez can support any ERC-20 token, it's primarily designed with high-frequency tokens like ETH, DAI, Tether, and wBTC in mind.

## How long does a transaction take?

While a coordinator will receive a transaction almost instantly, they need to forge the blocks and generate the zk-proofs as a first stage.

Since both data and zk-proofs of correctness need to be included on the Ethereum base-chain, the time for data to be reliably included (ideally finalized) on-chain depends on the Ethereum block time.

To quote [Vitalik](https://vitalik.ca/general/2019/12/26/mvb.html):

> **The block time of the base layer sets the latency for anything whose confirmation depends things being included in the base layer.** This could be worked around with on-chain security deposits, aka "bonds", at the cost of high capital inefficiency, but such an approach is inherently imperfect because a malicious actor could trick an unlimited number of different people by sacrificing one deposit.

We expect that some systems can be developed as a new layer on top of zk-rollups where coordinators can guarantee finality of transactions with instant confirmations (a sort of economic finality for low-value transactions).

## How are transaction fees paid by users?

The default is to pay fees in the same token you’re sending,

But with two atomic (linked) transactions you can pay a fee in a different token.

## What if the ERC-20 token I wish to transact with is not yet supported?

Most common tokens will be preloaded in the system. In any case, there is a rollup function for this. But you'll need to pay a small fee in order to add a token.

## Which interface will users have available?

Hermez will deliver a web wallet for users to operate with the network, and it will be connected to Metamask wallet for Ethereum key management.

We expect integration with other wallets and independent implementations to appear.

## Can coordinators take my money?

No.

## Can coordinators censor transactions?

Coordinators can decide which transactions they select to include in the batch to forge.

In case that a coordinator censures a transaction, users have the option to force coordinators to include their transaction. This is done by sending an on-chain transaction (`forceExit` or `forceTransfer`)
