# WebApp Wallet

> TODO
>  Screen captures of wallet and description of how to use it

## Features
- Single page webapp
- Connects to Boot Coordinator's REST API
- Uses metamask
  - Key management
  - Every time one authenticates with the wallet the private key is retrieved.
  - Authorization required at transaction level. 

- Actions off-chain:
  - **Tansfer**: standard off-chain rollup transaction between rollup accounts
  - **Exit**: standrad off-chain transaction to get back funds from rollup to contract

- Actions on-chain:
  - **Deposit**: create rollup account
  - **DepositOnTop**: filling one already created rollup account
  - **Withdrawal**: get funds back to your ethereum address after an off-chain exit transaction.
  - **ForcedExit**: force the operator to process an exit. 
  - **ForcedTransfer**: force the operator to process a rollup transfer

- Information shown:
  - Qr code / copy-paste for the public rollup key
  - Generate QR code with data regarding transaction where you have set few parameters: token and amount
  - Rollup balance (several tokens)
  - Transaction history (linked to Batch Explorer)
  - Fees --> operator suggests a fee to be payed 
    - user may select this fee.
    - user may choose different fee (advanced options)


## URL

Wallet is deployed [here](http://18.223.28.208).
