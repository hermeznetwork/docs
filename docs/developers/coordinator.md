# Hermez Node
This tutorial describes how to launch a Hermez node. It starts by explaining how to launch a Boot Coordinator in localhost.
Next, it describes how to initialize a Proof Server and how to connect it to the Boot Coordinator.
The next section describes how to spin up a second Hermez node in synchronizer mode to track the rollup status independently from the Boot Coordinator. This second node will be launched in Rinkeby testnet.
The last part of the tutorial includes an explanation on how to add a second Coordinator node to Hermez testnet that bids for the right to forge batches.
 
1. [Preparing the Environment](#preparing-the-environment) 
2. [Launching the Boot Coordinator](#launching-the-boot-coordinator)
3. [Launching a Proof Server](#launching-a-proof-server)
4. [Launching a Synchronizer Node](#launching-a-synchronizer-node)
5. [Launching a Second Coordinator](#launching-a-second-coordinator-node)

## Preparing the Environment
Hermez node requires a PostgreSQL database and connectivity to an Ethereum node. In this part, we describe how you can set this environment
up using docker containers.

### Dependencies
- [golang 1.16+](https://golang.org/doc/install) 
- packr utility to bundle the database migrations. Make sure your `$PATH` contains `$GOPATH/bin`, otherwise the packr utility will not be found.
```shell
cd /tmp && go get -u github.com/gobuffalo/packr/v2/packr2 && cd -
```
- docker and docker-compose without sudo permission (optional if you want to use the provided PostgreSQL and Geth containers)
   - [docker](https://docs.docker.com/engine/install/ubuntu/)
   - [docker-compose](https://docs.docker.com/compose/install/)
- [aws cli 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) (optional if you want to use the provided Geth container)

### Setup
1. Clone [hermez-node](https://github.com/hermeznetwork/hermez-node.git) repository
```shell
git clone https://github.com/hermeznetwork/hermez-node.git
```
2. Build `hermez-node` executable
```shell
cd hermez-node
make build
```
The executable can be found in `bin/node`


3. Deploy PostgreSQL database and Geth node containers. For this step we provide a docker-compose file example. Copy contents to file named `docker-compose.sandbox.yaml`
```yaml
version: "3.3"
services:
  hermez-db-test:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: "hermez"
      POSTGRES_PASSWORD: "yourpasswordhere"
  privatebc:
    image:  public.ecr.aws/r7d5k1t8/hermez-geth:latest
    ports:
      - "8545:8545"
    environment:
      - DEV_PERIOD
    entrypoint: ["geth", "--http", "--http.addr", "0.0.0.0","--http.corsdomain", "*", "--http.vhosts" ,"*", "--ws", 
    "--ws.origins", "*", "--ws.addr", "0.0.0.0", "--dev", "--datadir", "/geth_data$DEV_PERIOD"]
```

Login to AWS public ECR to be able to download the Geth docker image:

```shell
export AWS_REGION=eu-west-3
aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 811278125247.dkr.ecr.eu-west-3.amazonaws.com
```

Start database and Geth node:
```shell
DEV_PERIOD=3 docker-compose -f docker-compose.sandbox.yaml up -d
```
This command will start a Geth node mining a block every 3 seconds. 
Database is available at port 5432. Geth node is available at port 8545.

To stop containers:
```shell
docker-compose -f docker-compose.sandbox.yaml down
```

The Geth container comes with pre-deployed Hermez contracts and with 200 funded accounts.
```
 "hermezAuctionProtocolAddress": "0x317113D2593e3efF1FfAE0ba2fF7A61861Df7ae5"
 "hermezAddress": "0x10465b16615ae36F350268eb951d7B0187141D3B"
 "withdrawalDelayeAddress": "0x8EEaea23686c319133a7cC110b840d1591d9AeE0"
 "HEZTokenAddress": "0x5E0816F0f8bC560cB2B9e9C87187BeCac8c2021F"
 "hermezGovernanceIndex": 1
 "hermezGovernanceAddress": "0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb"
 "emergencyCouncilIndex": 2
 "emergencyCouncilAddress": "0x306469457266CBBe7c0505e8Aad358622235e768"
 "donationIndex": 3
 "donationAddress": "0xd873F6DC68e3057e4B7da74c6b304d0eF0B484C7"
 "bootCoordinatorIndex": 4
 "mnemonic": "explain tackle mirror kit van hammer degree position ginger unfair soup bonus"
 "chainId" : 1337
}
```


4. Configure `cfg.buidler.toml` file. The configuration file located at `cli/node/cfg.buidler.toml` needs to be customized to be able to deploy the Hermez node using the predeployed contracts.

You will need to change the `PriceUpdater` section to limit the frequency of the updates so that the logs are not clogged with price update information, the `SmartContract` section to 
reflect the location of the deployed contracts, and the address of the Coordinator node. Just substitute the sections below in the `cfg.buidler.toml` file.


```
[PriceUpdater]
Interval = "1000s"
```

```
[SmartContracts]
Rollup   = "0x10465b16615ae36F350268eb951d7B0187141D3B"
Auction  = "0x317113D2593e3efF1FfAE0ba2fF7A61861Df7ae5"
WDelayer = "0x8EEaea23686c319133a7cC110b840d1591d9AeE0"
TokenHEZ = "0x5E0816F0f8bC560cB2B9e9C87187BeCac8c2021F"
TokenHEZName = "Hermez Network Token"
```

```
[Coordinator]
ForgerAddress = "0xDcC5dD922fb1D0fd0c450a0636a8cE827521f0eD" # Non-Boot Coordinator
```
For more information on the parameters in the configuration file, see [this](https://github.com/hermeznetwork/hermez-node/blob/master/config/config.go#L57).

## Launching the Boot Coordinator
It is recommended to run the Coordinator node in a server with 8+ cores, 16 GB+ of RAM and 250GB of disk (AWS c5a.2xlarge or equivalent).

1. Copy `cfg.buidler.toml` file. The configuration file can be found in `hermez-node/cli/node` folder
```shell
cp cli/node/cfg.buidler.toml cli/node/cfg.boot-coordinator.cfg
```

2. Import the Coordinator Ethereum private key into the keystore. 
```shell
./bin/node importkey --mode coord --cfg ./cli/node/cfg.boot-coordinator.toml --privatekey 0x705df2ae707e25fa37ca84461ac6eb83eb4921b653e98fdc594b60bea1bb4e52
```
This private key corresponds to the Coordinator node (it has the index 4 of the pre-generated accounts). You only need to import the key once.
 
3. Start a mock proof server. 
```shell
cd test/proofserver/cli
go build .
./cli -d 15s -a 0.0.0.0:3000
```
The `hermez-node` repository provides a mock proof server that generates mock proofs every 15 seconds. The mock prover is launched at http://localhost:3000, and it exports two endpoints:
- GET /api/status: Queries the prover's status.
- POST /api/input: Starts the generation of a new proof.

4. Wipe SQL database

Before starting the Coordinator node, you may want to wipe the pre-existing SQL database.
```shell
./bin/node wipesql --mode coord --cfg cli/node/cfg.boot-coordinator.toml 
```

5. Launch `hermez-node`
```shell
./bin/node run --mode coord --cfg cli/node/cfg.boot-coordinator.toml
```

Once the Hermez node is launched, the API can be queried at `localhost:8086/v1`.



For more information, check the [README](https://github.com/hermeznetwork/hermez-node/tree/master/cli/node) file.

## Launching a Proof Server
We will use [rapidsnark](https://github.com/iden3/rapidsnark) as the Hermez proof server. `rapidsnarks` is a zkSnark proof generator written in C++.
It is recommended to run the proof server in servers with 48+ cores, 96 GB+ of RAM and 250GB of disk (AWS c5a.12xlarge or equivalent).

> rapidsnark requires a host CPU that supports ADX extensions. 

### Dependencies
- [node v12+](https://nodejs.org/en/download/)
- npm
```shell
apt install npm
```
- npx
```shell
npm i -g npx
```

- Install gcc, libsodium, gmp
```
sudo apt install build-essential
sudo apt-get install libgmp-dev
sudo apt-get install libsodium-dev
sudo apt-get install nasm
```
- cmake
```shell
apt install cmake
```

### Circuit Files
Download circuit and auxiliary files. These files are extremely large (20GB+), so make sure you have enough bandwidth.

There are two Hermez circuits that have undergone the Trusted Setup Ceremony. 
- circuit-2048-32-256-64 with 2048 transactions per batch (~2^27 constraints)
- circuit-400-32-256-64 with 400 transactions per batch (~2^25 constraints)

For each type of circuit, you will need the following files:
- C++ source file (extension .cpp)
- Data file (extension .dat)
- Verification and Proving Key files (extension .zkey)

[circuit-400-32-256-64.cpp](https://hermez.s3-eu-west-1.amazonaws.com/circuit-400-32-256-64.cpp)

[circuit-400-32-256-64.dat](https://hermez.s3-eu-west-1.amazonaws.com/circuit-400-32-256-64.dat)

[circuit-400-32-256-64_hez4_final.zkey](https://hermez.s3-eu-west-1.amazonaws.com/circuit-400-32-256-64_hez4_final.zkey)

[circuit-2048-32-256-64.cpp](https://hermez.s3-eu-west-1.amazonaws.com/circuit-2048-32-256-64.cpp)

[circuit-2048-32-256-64.dat](https://hermez.s3-eu-west-1.amazonaws.com/circuit-2048-32-256-64.dat)

[circuit-2048-32-256-64_hez4_final.zkey](https://hermez.s3-eu-west-1.amazonaws.com/circuit-2048-32-256-64_hez4_final.zkey)


More information on Trusted Setup can be found [here](https://github.com/hermeznetwork/phase2ceremony_4).

### Setup
1. Clone [rapidsnark](https://github.com/iden3/rapidsnark.git) repository
```shell
git clone  https://github.com/iden3/rapidsnark.git
```
2. Compile the prover.

In this example we are building the 400 transactions prover.
```shell
cd rapidsnark
npm install
git submodule init
git submodule update
npx task createFieldSources
npx task buildPistche
npx task buildProverServer ../circuit-400-32-256-64.cpp
```
3. Launch prover
```shell
cd ..
./rapidsnark/build/proverServer circuit-400-32-256-64.dat circuit-400-32-256-64_hez4_final.zkey
```
Prover is deployed at port 9080.

4. Check prover status
```shell
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:9080/status
```

### Generate a Prover Input File

1. Clone [circuits](https://github.com/hermeznetwork/circuits.git) repository
```shell
git clone https://github.com/hermeznetwork/circuits.git
```

2. Install dependencies
```shell
cd circuits
npm install
cd tools
```

In this example we are working with `circuit-400-32-236-64_hez1.zkey`, which corresponds to a circuit with 400 transactions, 32 levels, 256 maxL1Tx and 64 maxFeeTx.

3. Generate Input file

To generate a new input file with empty transactions:

```shell
node build-circuit.js input 400 32 256 64
```
This command generates a new input file `rollup-400-32-256-64/input-400-32-256-64.json`

To generate a new input file with random transactions
```shell
node generate-input.js 256 144 400 32 256 64
``` 
This will create a new input file called `inputs-256.json` 

### Generate a New Proof

You can use curl to post any of the inputs generated in the previous step.
```shell
curl -X POST -d @inputs-256.json http://localhost:9080/input
```
or
```shell
curl -X POST -d @input-400-32-256-64.json http://localhost:9080/input
```

You check the status of the prover by querying the `/status` endpoint.
```shell
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:9080/status
```
`/status` returns if the prover is ready to accept a new input as well as the proof result and input data of the previous iteration. An example is shown below.

```json
{"proof":"{\"pi_a\":[\"15669797899330531899539165505099185328127025552675136844487912123159422688332\",\"4169184787514663864223014515796569609423571145125431603092380267213494033234\",\"1\"],\"pi_b\":[[\"15897268173694161686615535760524608158592057931378775361036549860571955196024\",\"7259544064908843863227076126721939493856845778102643664527079112408898332246\"],[\"11114029940357001415257752309672127606595008143716611566922301064883221118673\",\"11641375208941828855753998380661873329613421331584366604363069099895897057080\"],[\"1\",\"0\"]],\"pi_c\":[\"3069279014559805068186938831761517403137936718184152637949316506268770388068\",\"17615095679439987436388060423042830905459966122501664486007177405315943656120\",\"1\"],\"protocol\":\"groth16\"}","pubData":"[\"18704199975058268984020790304481139232906477725400223723702831520660895945049\"]","status":"success"}
```

### Connect Prover to Coordinator Node
Once you have verified the prover is working, you can connect it to the Hermez Coordinator by configuring the `cfg.boot-coordinator.toml` configuration file.
You need to substitute sections `ServerProofs` with the updated URL where prover is deployed, and the `Circuit` section where the verifier smart contract is specified.

```
[[Coordinator.ServerProofs]]
URL = "http://localhost:9080"
```

```
[Coordinator.Circuit]
MaxTx = 400
NLevels = 32
```

At this point, you can stop the mock server if it is still running, and re-launch the coordinator as we saw in the previous section. The new prover will be running at http://localhost:9080, and the two endpoints are `/status` and `/input`


## Launching a Synchronizer Node
In synchronizer mode, the node is capable of keeping track of the rollup and consensus smart contracts, storing all the history of events and keeping the rollup
state updated, handling reorgs when they happen. This mode is intended for entities that want to gather all the rollup data by themselves and not rely on third party APIs.
For this part of the tutorial, we are going to deploy the syncrhonizer node in testnet on Rinkeby.

1. Stop Coordinator node launched in localhost in previous steps.

Stop prover, coordinator node and containers from previous phases as you will be working in testnet with a real Boot Coordinator node.
```shell
docker-compose -f docker-compose.sandbox.yaml down
```

2. Launch PostgreSQL database

The Hermez node in synchronizer mode needs to run a separate database
```shell
docker run --rm --name hermez-db -p 5432:5432 -e POSTGRES_DB=hermez -e POSTGRES_USER=hermez -e POSTGRES_PASSWORD="yourpasswordhere" -d postgres
```

3. Start an Ethereum node in Rinkeby

You can use Infura or you can run your own node using Geth.
- Pre-built binaries for all platforms on our downloads page (https://geth.ethereum.org/downloads/).
- Ubuntu packages in our Launchpad PPA repository (https://launchpad.net/~ethereum/+archive/ubuntu/ethereum).
- OSX packages in our Homebrew Tap repository (https://github.com/ethereum/homebrew-ethereum).

Sync this node with Rinkeby testnet where all Hermez's smart contracts are deployed. 

> Note that synchronizing with Infura will be too slow, and it may fail beacuse the number of queries is limited. We recommend to deploy your own Ethereum node.


4. Get contract addresses

Query Testnet API for the addresses of the Hermez smart contracts.

```shell
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET api.testnet.hermez.io/v1/config
```
At this moment, the contracts are deployed in these addresses
```
"tokenHEZ":"0x2521bc90b4f5fb9a8d61278197e5ff5cdbc4fbf2",
"hermezAuctionContract":"0x0a8a6d65ad9046c2a57a5ca8bab2ae9c3345316d",
"withdrawDelayerContract":"0xefd96cfbaf1b0dd24d3882b0d6b8d95f85634724"
"hermezRollup":"0x679b11e0229959c1d3d27c9d20529e4c5df7997c"
```

5. Update Configuration file. Let's call this new file `cfg.sync.toml`. Make sure you add the correct contract addresses and the Rinkeby Node URL.

```
[API]
Address = "localhost:8086"
Explorer = true
UpdateMetricsInterval = "10s"
UpdateRecommendedFeeInterval = "10s"
MaxSQLConnections = 100
SQLConnectionTimeout = "2s"

[PriceUpdater]
Interval = "10s"
URLBitfinexV2 = "https://api-pub.bitfinex.com/v2/"
URLCoinGeckoV3 = "https://api.coingecko.com/api/v3/"
# Available update methods:
# - coingeckoV3 (recommended): get price by SC addr using coingecko API
# - bitfinexV2: get price by token symbol using bitfinex API
# - static (recommended for blacklisting tokens): use the given StaticValue to set the price (if not provided 0 will be used)
# - ignore: don't update the price leave it as it is on the DB
DefaultUpdateMethod = "coingeckoV3" # Update method used for all the tokens registered on the network, and not listed in [[PriceUpdater.TokensConfig]]
[[PriceUpdater.TokensConfig]]
UpdateMethod = "bitfinexV2"
Symbol = "USDT"
Addr = "0xdac17f958d2ee523a2206206994597c13d831ec7"
[[PriceUpdater.TokensConfig]]
UpdateMethod = "coingeckoV3"
Symbol = "ETH"
Addr = "0x0000000000000000000000000000000000000000"
[[PriceUpdater.TokensConfig]]
UpdateMethod = "static"
Symbol = "UNI"
Addr = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
StaticValue = 30.12
[[PriceUpdater.TokensConfig]]
UpdateMethod = "ignore"
Symbol = "SUSHI"
Addr = "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"

[StateDB]
Path = "hermez/statedb"
Keep = 256

[PostgreSQL]
PortWrite     = 5432
HostWrite     = "hermez"
UserWrite     = "hermez"
PasswordWrite = "yourpasswordhere"
NameWrite     = "hermez"

[Web3]
URL = "ADD RINKEBY NODE URL HERE"

[Synchronizer]
SyncLoopInterval = "1s"
StatsRefreshPeriod = "1s"
StatsUpdateBlockNumDiffThreshold = 100
StatsUpdateFrequencyDivider = 100

[SmartContracts]
Rollup   = "0x679b11e0229959c1d3d27c9d20529e4c5df7997c"
Auction  = "0x0a8a6d65ad9046c2a57a5ca8bab2ae9c3345316d"
WDelayer = "0xefd96cfbaf1b0dd24d3882b0d6b8d95f85634724"
TokenHEZ = "0x2521bc90b4f5fb9a8d61278197e5ff5cdbc4fbf2"
TokenHEZName = "Hermez Network Token"

[RecommendedFeePolicy]
# Strategy used to calculate the recommended fee that the API will expose.
# Available options:
# - Static: always return the same value (StaticValue) in USD
# - AvgLastHour: calculate using the average fee of the forged transactions during the last hour
PolicyType = "Static"
StaticValue = 0.99
```

6. Launch `hermez-node` in synchronizer mode
```shell
./bin/node run --mode sync --cfg cli/node/cfg.sync.toml
```

Once the Hermez node is launched, the API can be queried at `localhost:8086/v1` (as well as at https://api.testnet.hermez.io/v1/ serviced by the Boot Coordinator node).

## Launching a Second Coordinator Node
In this part of the tutorial we will start a second Coordinator Node in testnet that will bid for the right to forge batches.

### Dependencies
- node 12+

### Start Coordinator in Testnet
1. Stop Synchronizer node and PostgreSQL container launched in previous steps.

2. Launch PostgreSQL database

```shell
docker run --rm --name hermez-db -p 5432:5432 -e POSTGRES_DB=hermez -e POSTGRES_USER=hermez -e POSTGRES_PASSWORD="yourpasswordhere" -d postgres
```
3. Launch Prover as shown [here](#launching-a-proof-server)
4. Create two Ethereum accounts in Rinkeby using Metamask wallet. One account is `forger` account (needs to pay to forge batches), and the second is the `fee` account (receives the fees). The fees are collected in L2.

5. Create a Wallet with `fee` account Ethereum Private Key. 

This wallet is needed to generate a Baby JubJub address where fees will be collected. There is an example code in the [SDK](https://github.com/hermeznetwork/hermezjs/blob/main/examples/create-wallet.js) that can be used. Simply substitue `EXAMPLES_WEB3_URL` by your Rinkeby Node URL and `EXAMPLES_PRIVATE_KEY1` by `fee` account private key.

This script will generate a similar output:
```json
{
  privateKey: <Buffer 3e 12 35 91 e9 99 61 98 24 74 dc 9c 09 70 0a cb d1 a5 c9 6f 34 2f ab 35 ca 44 90 01 31 f4 dc 19>,
  publicKey: [
    '554747587236068008597553797728983628103889817758448212785555888433332778905',
    '5660923625742030187027289840534366342931920530664475168036204263114974152564'
  ],
  publicKeyHex: [
    '139f9dba06599c54e09934b242161b80041cda4be9192360b997e4751b07799',
    'c83f81f4fce3e2ccc78530099830e29bf69713fa11c546ad152bf5226cfc774'
  ],
  publicKeyCompressed: '5660923625742030187027289840534366342931920530664475168036204263114974152564',
  publicKeyCompressedHex: '0c83f81f4fce3e2ccc78530099830e29bf69713fa11c546ad152bf5226cfc774',
  publicKeyBase64: 'hez:dMfPJlK_UtFqVByhP3FpvykOg5kAU3jMLD7OTx_4gwzO',
  hermezEthereumAddress: 'hez:0x74d5531A3400f9b9d63729bA9C0E5172Ab0FD0f6'
}
```
The Baby JubJub address is `publicKeyCompressedHex`. In this case, `0x0c83f81f4fce3e2ccc78530099830e29bf69713fa11c546ad152bf5226cfc774`.

6. Edit Configuration file

Copy original config file.
```shell
cp cfg.buidler.toml cfg.coord.cfg
```
And substitute the following sections. Make sure to configure your own Rinkeby Ethereum Node URL, the new Coordinator node Ethereum address and the Ethereum address where
collected fees will be deposited.

Let URL be accessible from outside
```
[API]
Address = "0.0.0.0:8086"
```

Initialize Ethereum Node URL
```
[Web3]
URL = "ADD RINKEBY NODE URL HERE"
```

Initialize smart contract addresses. They can be obtained using `api.testnet.hermez.io/v1/config` endpoint

```
[SmartContracts]
Rollup   = "0x679b11e0229959c1d3d27c9d20529e4c5df7997c"
Auction  = "0x0a8a6d65ad9046c2a57a5ca8bab2ae9c3345316d"
WDelayer = "0xefd96cfbaf1b0dd24d3882b0d6b8d95f85634724"
TokenHEZ = "0x2521bc90b4f5fb9a8d61278197e5ff5cdbc4fbf2"
TokenHEZName = "Hermez Network Token"
```

Initialize `forger account` Ethereum address
```
[Coordinator]
ForgerAddress = "ADD COORDINATOR ETH ADDRESS HERE" # Non-Boot Coordinator
```

Initialize `fee account` Ethereum and Baby JubJub addresses
```
[Coordinator.FeeAccount]
Address = "ADD FEE ETH ADDRESS HERE"
BJJ = "ADD BJJ ADDRESS HERE"
```

Initialize proof server address using IP address where Proof Server is deployed.
```
[[Coordinator.ServerProofs]]
URL = "http://0.0.0.0:9080"
```

Initialize used circuit
```
[Coordinator.Circuit]
MaxTx = 400
NLevels = 32
```

Adjust Gas
```
[Coordinator.EthClient.ForgeBatchGasCost]
Fixed = 900000
```

7. Import the `forger` and `fee` Ethereum private keys into the keystore. 
```shell
./bin/node importkey --mode coord --cfg cli/node/cfg.coord.toml --privatekey <FORGER ACCOUNT_PRIVATE KEY>
./bin/node importkey --mode coord --cfg cli/node/cfg.coord.toml --privatekey <FEE_ACCOUNT PRIVATE KEY>
```
This private key corresponds to the new Coordinator node 

8. Get ETH and HEZ to the `forger` account.

You need to fund the `forger` account with some ETH and some HEZ. 
You can also use Metamask and generate a `send` transaction from `forger` account to the HEZ token address. This transaction will add 100HEZ to the `forger` account.

9. Launch New Coordinator Node
```shell
./bin/node run --mode coord --cfg cli/node/cfg.coord.toml
```
The node will start synchronizing with the Hermez Network in testnet. This may take a while.

### Bidding Process
Once the node is synchronized, you can start bidding for the right to forge a batch.

1. Install cli-bidding

cli-bidding is a tool that allows to register a Coordinator in Hermez Network and place bids in the auction.

```shell
git clone https://github.com/hermeznetwork/cli-bidding.git
```
Once downloaded, follow the installation steps. `PRIVATE_KEY_CLI_BIDDING` corresponds to the `forger` private key.

2. Register Forger

Using `cli-bidding`, you need to register the new Coordinator API URL. In our case, we have the Coordinator node running at `http://134.255.190.114:8086`
```
node src/biddingCLI.js register --url http://134.255.190.114:8086
```
>NOTE. In order for the wallet-ui to be able to forward transactions to this coordinator, the API needs to be accessible from a https domain.

3. Get Current Slot in Hermez bid

Take a look at the current slot being bid in Hermez. When bidding, you need to bid at least 2 slots after the curent slot
```shell
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:8086/v1/state
```
In the json returned, there is a field, `network.currentSlot`, with the current Hermez slot. Let's assume this `currentSlot` is 4200

4. Check Minimum bid

Auctions have a minimum bid. You can check the current minimum bid for the upcomming slots
```shell
node src/biddingCLI.js slotinfo --startingSlot 4200 --endingSlot 4210
```

In our case, minimum bidding is set to 1.1 HEZ.

4. Bidding Process

Send a simple bid of 1.1x10^18 HEZ for slot 4200. Parameter `amount` is the amount to be transferred to the auction smart contract. Parameter `bidAmount` is the actual bid amount. Thus `amount` >= `bidAmount` unless there are some existing funds previously transferred.

```shell
node src/biddingCLI.js bid --amount 1.1 --slot 4200 --bidAmount 1.1
```

If the bidding process is successful, an Etherscan URL with the transaction id is returned to verify transaction.

You can check the allocated nextForgers using 
```shell
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:8086/v1/state
```

When the time to forge the auctioned slots comes, the node you supplied will be the one forging the upcoming batches.

`cli-bidding` provides additional mechanism to bid in multple slots at once. Check the [README file](https://github.com/hermeznetwork/cli-bidding)


