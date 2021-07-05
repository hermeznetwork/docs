```toml
[API]
Address = "localhost:8086"
Explorer = true
UpdateMetricsInterval = "10s"
UpdateRecommendedFeeInterval = "10s"
MaxSQLConnections = 100
SQLConnectionTimeout = "2s"

[PriceUpdater]
Interval = "100s"
URLBitfinexV2 = "https://api-pub.bitfinex.com/v2/"
URLCoinGeckoV3 = "https://api.coingecko.com/api/v3/"
# Available update methods:
# - coingeckoV3 (recommended): get price by SC addr using coingecko API
# - bitfinexV2: get price by token symbol using bitfinex API
# - static (recommended for blacklisting tokens): use the given StaticValue to set the price (if not provided 0 will be used)
# - ignore: don't update the price leave it as it is on the DB
DefaultUpdateMethod = "coingeckoV3" # Update method used for all the tokens registered on the network, and not listed in [[PriceUpdater.TokensConfig]]
[[PriceUpdater.TokensConfig]]
UpdateMethod = "coingeckoV3"
Symbol = "ETH"
Addr = "0x0000000000000000000000000000000000000000"
[[PriceUpdater.TokensConfig]]
UpdateMethod = "bitfinexV2"
Symbol = "HEZ"
Addr = "0x5E0816F0f8bC560cB2B9e9C87187BeCac8c2021F"


[Debug]
APIAddress = "0.0.0.0:12345"
MeddlerLogs = true
GinDebugMode = true

[StateDB]
Path = "/tmp/hermez/statedb"
Keep = 256

[PostgreSQL]
PortWrite     = 5432
HostWrite     = "localhost"
UserWrite     = "hermez"
PasswordWrite = "yourpasswordhere"
NameWrite     = "hermez"

[Web3]
URL = "http://localhost:8545"

[Synchronizer]
SyncLoopInterval = "1s"
StatsUpdateBlockNumDiffThreshold = 100
StatsUpdateFrequencyDivider = 100

[SmartContracts]
Rollup   = "0x10465b16615ae36F350268eb951d7B0187141D3B"


[Coordinator]
ForgerAddress = "0xDcC5dD922fb1D0fd0c450a0636a8cE827521f0eD" # Non-Boot Coordinator
# ForgerAddressPrivateKey = "0x705df2ae707e25fa37ca84461ac6eb83eb4921b653e98fdc594b60bea1bb4e52"

MinimumForgeAddressBalance = "0"
ConfirmBlocks = 10
L1BatchTimeoutPerc = 0.6
StartSlotBlocksDelay = 2
ScheduleBatchBlocksAheadCheck = 3
SendBatchBlocksMarginCheck = 1
ProofServerPollInterval = "1s"
ForgeRetryInterval = "500ms"
SyncRetryInterval = "1s"
ForgeDelay = "10s"
ForgeNoTxsDelay = "0s"
PurgeByExtDelInterval = "1m"
MustForgeAtSlotDeadline = true
IgnoreSlotCommitment = false

[Coordinator.FeeAccount]
Address = "0xCfDe8f47215a147e3876efa0c059771159c4FC70"
# PrivateKey = "0xfdb75ceb9f3e0a6c1721e98b94ae451ecbcb9e8c09f9fc059938cb5ab8cc8a7c"
BJJ = "0x1b176232f78ba0d388ecc5f4896eca2d3b3d4f272092469f559247297f5c0c13"
# BJJPrivateKey = "0xb556862fb60e7cf4c0a8a7f44baf2ab06a4c90ac39decc4eef363b6142d07a34"

[Coordinator.L2DB]
SafetyPeriod = 10
MaxTxs       = 512
MinFeeUSD    = 0.0
MaxFeeUSD    = 50.0
TTL          = "24h"
PurgeBatchDelay = 10
InvalidateBatchDelay = 20
PurgeBlockDelay = 10
InvalidateBlockDelay = 20

[Coordinator.TxSelector]
Path = "/tmp/hermez/txselector"

[Coordinator.BatchBuilder]
Path = "/tmp/hermez/batchbuilder"

[[Coordinator.ServerProofs]]
URL = "http://localhost:3000/api"

[Coordinator.Circuit]
MaxTx = 512
NLevels = 32

[Coordinator.EthClient]
CheckLoopInterval = "500ms"
Attempts = 4
AttemptsDelay = "500ms"
TxResendTimeout = "2m"
NoReuseNonce = false
MaxGasPrice = "5000000000"
GasPriceIncPerc = 10

[Coordinator.EthClient.Keystore]
Path = "/tmp/hermez/ethkeystore"
Password = "yourpasswordhere"

[Coordinator.EthClient.ForgeBatchGasCost]
Fixed = 600000
L1UserTx = 15000
L1CoordTx = 8000
L2Tx = 250

[Coordinator.API]
Coordinator = true

[Coordinator.Debug]
BatchPath = "/tmp/hermez/batchesdebug"
LightScrypt = true
# RollupVerifierIndex = 0

[Coordinator.Etherscan]
URL = "https://api.etherscan.io"
APIKey = "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"

[RecommendedFeePolicy]
# Strategy used to calculate the recommended fee that the API will expose.
# Available options:
# - Static: always return the same value (StaticValue) in USD
# - AvgLastHour: calculate using the average fee of the forged transactions during the last hour
PolicyType = "Static"
StaticValue = 0.99
```
