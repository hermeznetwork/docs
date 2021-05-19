```toml
[API]
Address = "0.0.0.0:8086"
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
# DefaultUpdateMethod = "coingeckoV3" # Update method used for all the tokens registered on the network, and not listed in [[PriceUpdater.TokensConfig]]
DefaultUpdateMethod = "bitfinexV2"
[[PriceUpdater.TokensConfig]]
UpdateMethod = "bitfinexV2"
Symbol = "HEZ"
Addr = "0x2521Bc90B4f5Fb9a8D61278197e5FF5cDbc4FBF2"
[[PriceUpdater.TokensConfig]]
UpdateMethod = "static"
Symbol = "DAI"
Addr = "0x4232AF76301fd6c2B144A7A5A7796331B2A43D90"
StaticValue = 1.0
[[PriceUpdater.TokensConfig]]
UpdateMethod = "static"
Symbol = "UST"
Addr = "0xa1A31DE489C9b977fa78c70C7f001da181e126FB"
StaticValue = 1.0
[[PriceUpdater.TokensConfig]]
UpdateMethod = "bitfinexV2"
Symbol = "ETH"
Addr = "0x0000000000000000000000000000000000000000"
[[PriceUpdater.TokensConfig]]
UpdateMethod = "bitfinexV2"
Symbol = "UNI"
Addr = "0xcd9a805b188e5E159f1777cE7822d2bF793dA6ab"
[[PriceUpdater.TokensConfig]]
UpdateMethod = "bitfinexV2"
Symbol = "LINK:"
Addr = "0x703ba5Da3Db04bDE7ddc9E5D675C5DC97ed65267"


[Debug]
APIAddress = "0.0.0.0:12345"
MeddlerLogs = true

[StateDB]
Path = "/tmp/hermez/statedb"
Keep = 256

[PostgreSQL]
# TODO: Add user, pwd and host for pg database
PortWrite     = 5432
HostWrite     = "localhost"
UserWrite     = "hermez"
PasswordWrite = "yourpasswordhere"
NameWrite     = "hermez"

[Web3]
# TODO  - Add you Ethereum node URL here
#URL = "http://10.48.1.224:8545"

[Synchronizer]
SyncLoopInterval = "1s"
StatsUpdateBlockNumDiffThreshold = 100
StatsUpdateFrequencyDivider = 100
StatsRefreshPeriod = "1s"

[SmartContracts]
#TODO  - Check Rollup address is matches the one displayed at https://api.testnet.hermez.io/v1/state
Rollup   = "0x679b11E0229959C1D3D27C9d20529E4C5DF7997c"


[Coordinator]
#TODO - Add you coordinator's Ethereum Address
#ForgerAddress = "0xaFd6e65bdB854732f39e2F577c67Ea6e83a4C2c2"  # Coordinator
MinimumForgeAddressBalance = 0
ConfirmBlocks = 5
L1BatchTimeoutPerc = 0.2
ProofServerPollInterval = "1s"
ForgeRetryInterval = "10s"
SyncRetryInterval = "1s"
ForgeDelay = "60s"
ForgeNoTxsDelay = "60s"
PurgeByExtDelInterval = "1m"
MustForgeAtSlotDeadline = true
IgnoreSlotCommitment = false
ForgeOncePerSlotIfTxs = true

[Coordinator.FeeAccount]
# TODO - Add Fee account Ethereum address
#Address = "0xbDF0C0f0B367Ade948545140788FE2db319B7B61"
#BJJ = "Add Fee account internal address" TODO
#BJJ = "0x8f785561426c4caa16b6b37283e6d68ef7873a2ccd3dc7eb004274189983dd60"
[Coordinator.L2DB]
SafetyPeriod = 10
MaxTxs       = 1000000
MinFeeUSD    = 0.50
MaxFeeUSD    = 10.00
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
# TODO - Add Prover server URL
#URL = "http://10.48.11.153:9080"

[Coordinator.Circuit]
# TODO - Check circuit size (2048/400)
MaxTx = 2048
NLevels = 32

[Coordinator.EthClient]
ReceiptTimeout      = "60s"
ReceiptLoopInterval = "500ms"
CheckLoopInterval = "500ms"
Attempts = 4
AttemptsDelay = "500ms"
CallGasLimit = 300000
GasPriceDiv = 100
MaxGasPrice = "5000000000"
TxResendTimeout = "2m"

[Coordinator.EthClient.Keystore]
Path = "/home/ubuntu/keystore"
Password = "yourpasswordhere"

[Coordinator.EthClient.ForgeBatchGasCost]
Fixed = 900000
L1UserTx = 15000
L1CoordTx = 7000
L2Tx = 600

[Coordinator.API]
Coordinator = true

[Coordinator.Debug]
BatchPath = "/tmp/hermez/batchesdebug"
LightScrypt = false
# RollupVerifierIndex = 0

[RecommendedFeePolicy]
# Strategy used to calculate the recommended fee that the API will expose.
# Available options:
# - Static: always return the same value (StaticValue) in USD
# - AvgLastHour: calculate using the average fee of the forged transactions during the last hour
PolicyType = "Static"
StaticValue = 0.50
```



