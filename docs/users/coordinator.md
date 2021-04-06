# Coordinator
This tutorial focuses on how to launch a Hermez Coordinator node on localhost using the available tools. It includes two parts:
1. [Launching a Coordinator Node](#coordinator-node)
2. [Launching a Proof Server](#proof-server)

## Coordinator Node
### Dependencies
- golang 1.14+
- [aws cli 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- packr utility to bundle the database migrations. Make sure your `$PATH` contains `$GOPATH/bin`, otherwise the packr utility will not be found.
```shell
cd /tmp && go get -u github.com/gobuffalo/packr/v2/packr2 && cd -
```
- docker and docker-compose without sudo permission

### Setup
1. Clone [hermez-node](https://github.com/hermeznetwork/hermez-node.git) repo
```shell
git clone https://github.com/hermeznetwork/hermez-node.git
```
2. Build `hermez-node` executable
```shell
cd hermez-node/db && packr2 && cd ../cli/node
go build .
cd ../../db && packr2 clean && cd -
```
The executable can be found in cli/node/node


3. Deploy postgresql database and geth node. For this step we provide a docker-compose file example. Copy contents to file named `docker-compose.sandbox.yaml`
```
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

To login to AWS public ECR to be able to download the geth docker image:

```shell
export AWS_REGION=eu-west-3
aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 811278125247.dkr.ecr.eu-west-3.amazonaws.com
```

To start the database and the geth node:
```shell
DEV_PERIOD=3 docker-compose -f docker-compose.sandbox.yaml up -d
```
This command will start a geth node mining a block every 3 seconds. 
Database is available at port 5432. Geth node is available at port 8545.

To stop containers
```shell
docker-compose -f docker-compose.sandbox.yaml down
```

The geth container comes with Hermez contracts predeployed at the following addresses and with 200 funded accounts.
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

4. Configure `cfg.buidler.toml` file. The configuration file located at `cli/node/cfg.buidler.toml` needs to be customized to be able to deploy the Hermez Coordinator node using the predeployed contracts.

You will need to change the `PriceUpdater` section to limit the frequency of the updates so that the logs are not clogged with price update information, the `SmartContract` section to 
reflect the location of the deployed contracts, and the address of the Coordinator node. Just copy the sections below and substitute them in the `cfg.buidler.toml` file.


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

5. Import the Coordinator Ethereum private key into the keystore. 
```shell
./node importkey --mode coord --cfg cfg.buidler.toml --privatekey 0x705df2ae707e25fa37ca84461ac6eb83eb4921b653e98fdc594b60bea1bb4e52
```
This private key corresponds to the Coordinator node (it has the index 4 of the pre-generated accounts). You only need to import the key once.
 
6. Start a mock proof server. 
```shell
cd ../../test/proofserver/cli
go build .
./cli -d 15s -a 0.0.0.0:3000
```
The `hermez-node` repository provides a mock proof server that generates mock proofs every 15 seconds. The mock prover is launched at http://localhost:3000, and it exports two endpoints:
- GET /api/status
- POST /api/input

7. Wipe SQL database
Before starting the Coordinator node, you may want to wipe the pre-existing SQL database.
```shell
./node wipesql --mode coord --cfg cfg.buidler.toml 
```

8. Launch `hermez-node`
```shell
./node run --mode coord --cfg cfg.buidler.toml
```

Once the Hermez node is launched, the API can be queried at `localhost:8086/v1`.




For more information, check the [README](https://github.com/hermeznetwork/hermez-node/tree/master/cli/node) file.

## Proof Server
A possible proof server is based on [rapidsnark](https://github.com/iden3/rapidsnark), a zkSnark proof generator written in C++.
It is recommended to run the proof server in servers with 32+ cores and 64 GB+ of RAM (AWS c5a.8xlarge or equivalent).

### Dependencies
- node v12+
- Install gcc, libsodium, gmp
```
sudo apt install build-essential
sudo apt-get install libgmp-dev
sudo apt-get install libsodium-dev
sudo apt-get install nasm
```

### Circuit Files
- Download circuit and auxiliary files. These files are extremely large (20GB+), so make sure you have enough bandwidth.

There are two Hermez circuits that have undergone the Trusted Setup Ceremony. 
- circuit-1912-32-256-64 with 1912 transactions per batch (~2^27 constraints)
- circuit-344-32-256-64 with 344 transactions per batch (~2^25 constraints)

For each type of circuit, you will need the following files:
- C++ source file (extension .cpp)
- Data file (extension .dat)
- Verification and Proving Key files (extension .zkey)

[circuit-344-32-256-64.cpp](https://hermez.s3-eu-west-1.amazonaws.com/circuit-344-32-256-64.cpp)

[circuit-344-32-256-64.dat](https://hermez.s3-eu-west-1.amazonaws.com/circuit-344-32-256-64.dat)

[circuit-344-32-256-64_hez3_final.zkey](https://hermez.s3-eu-west-1.amazonaws.com/circuit-344-32-256-64_hez3_final.zkey)

[circuit-1912-32-256-64.cpp](https://hermez.s3-eu-west-1.amazonaws.com/circuit-1912-32-256-64.cpp)

[circuit-1912-32-256-64.dat](https://hermez.s3-eu-west-1.amazonaws.com/circuit-1912-32-256-64.dat)

[circuit-1912-32-256-64_hez3_final.zkey](https://hermez.s3-eu-west-1.amazonaws.com/circuit-1912-32-256-64_hez3_final.zkey)


More information on Trusted Setup can be found [here](https://github.com/hermeznetwork/phase2ceremony_3).

### Setup
1. Clone [rapidsnark](https://github.com/iden3/rapidsnark.git) repo
```shell
git clone  https://github.com/iden3/rapidsnark.git
```
2. Compile the prover.

In this example we are building the 344 transactions prover.
```shell
cd rapidsnark
npm install
git submodule init
git submodule update
npx task createFieldSources
npx task buildPistche
npx task buildProverServer ../circuit-344-32-256-64.cpp
```
3. Launch prover
```shell
cd ..
./rapidsnark/build/proverServer circuit-344-32-256-64.dat circuit-344-32-256-64_hez3_final.zkey
```
Prover is deployed at port 9080.

4. Check prover status
```shell
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:9080/status
```

### Generate a Prover Input File

- clone repo [circuits](https://github.com/hermeznetwork/circuits.git)
```shell
git clone https://github.com/hermeznetwork/circuits.git
```

- Install dependencies
```shell
cd circuits
npm install
cd tools
```

In this example we are working with `circuit-344-32-236-64_hez1.zkey`, which correspods to a circuit with 344 transactions, 32 levels, 256 maxL1Tx and 64 maxFeeTx.

- Generate an input file

To generate a new input file with empty transactions:

```shell
node build-circuit.js input 344 32 256 64
```
This command generates a new input file `rollup-344-32-256-64/input-344-32-256-64.json`

To generate a new input file with random transactions
```shell
node generate-input.js 256 88 344 32 256 64
``` 
This will create a new input file called `inputs-256.json`. 

### Generate a New Proof

You can use curl to post any of the inputs generated in the previous step.
```shell
curl -X POST -d @inputs-256.json http://localhost:9080/input
curl -X POST -d @input-344-32-256-64.json http://localhost:9080/input
```

You check the status of the prover by querting the /status endpoint.
```shell
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:9080/status
```

### Connect Prover to Coordinator Node
Once you have verified the prover is working, you can connect it to the Hermez Coordinator by configuring the `cfg.buidler.toml` configuration file.
You need to substitute sections `ServerProofs` with the updated URL where prover is deployed, and the `Circuit` section where the verifier smart contract to use is specified.

```
[[Coordinator.ServerProofs]]
URL = "http://localhost:9080"
```

```
[Coordinator.Circuit]
MaxTx = 344
NLevels = 32
```

At this point you can stop the mock server if it is still running, and re-launch the coordinator as we saw in the previous section. The new prover will be running at http://localhost:9080, 
and the two end points are /status and /input
