# WebApp wallet

http://18.223.28.208


## Description
- Use metamask
- Key management: 
  - similar approach that Matter-labs is using
  - retrieve private key from `privBabyjubjub = hash(ecdsa(message-rollup-iden3))`

- Actions off-chain:
  - transfer: standard off-chain rollup transaction between rollup accounts
      - if transaction is sent to a non-existing rollup account, user should be notice that the price would increase a lot and if will create a new rollup account
  - exit: standrad off-chain transaction to get back fund from rollup to contract

- Actions on-chain:
  - deposit: create rollup account
      - depositOnTop: filling one already created rollup account
  - withdraw: get back your coins to your ethereum address that has been exit from the rollup through an off-chain exit transaction
  - forceExit: force the operator to process a withdraw. This funds will be get available on the rollup contract to be got back through the `withdraw` function.
  - forceTransfer: force the operator to process a rollup transaction

- Information shown:
  - Qr code / copy-paste for the public rollup key
  - Generate QR code with data regarding transaction where you have set few parameters: token and amount
  - Rollup balance (several tokens)
  - Transaction history (linked to the batch explorer)
  - Fees --> operator would suggest a fee to be paied in the user UI
    - user may select this fee, whuch webapp internally select among the %fees necessary (user agnostic) 
    - user may choose %fee for a transaction but it will be as an advanced option (like Metamask when a suggest you a gasPrice or you can change it on the advanced options)



