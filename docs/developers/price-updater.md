# Price Updater
[Price Updater](https://github.com/hermeznetwork/price-updater-service/) is a web service to consult and update token and fiat currency used by Hermez Node.

## Installation
```
$ git clone git@github.com:hermeznetwork/price-updater-service.git
$ cd price-updater-service/
$ go build -o priceupdater # or other name that you want
```

## Pre-requirements
1. It is necessary to have write access to a Hermez node data base. Price updater will update the prices and write to the database.
2. You need a API Key from `https://exchangeratesapi.io/`. 


## Usage
1. Configure `.env` file in `price-updater` main folder. Copy [file](developers/pudater-files/price-updater-env.md) to `.env`
`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST` and `POSTGRES_PORT` can be extracted from the Hermez node configuration file
`FIAT_API_KEY` can be obtaind from `https://exchangeratesapi.io/`.

2. Configure provider priority. Providers are selected in order. 
```
$ ./priceupdater change-priority --priority "bitfinex,coingecko,uniswap"
```
Price Updater provides configurations files to use Bitfinex, Coingecko and Uniswap as providers.
3. Update provided configuration
```
$ ./priceupdater update-config --provider bitfinex --configFile assests/mainnet/bitfinex.json
$ ./priceupdater update-config --provider coingecko --configFile assests/mainnet/coingecko.json 
$ ./priceupdater update-config --provider uniswap --configFile assests/mainnet/uniswap.json 
```
4. Run server
```
$ ./priceupdater server
```

If everything went well, you should see the following output:
```

2021-08-16T14:41:32Z    INFO    cli/server.go:33        connection established with postgresql server
 ┌───────────────────────────────────────────────────┐ 
 │                   Fiber v2.14.0                   │ 
 │               http://127.0.0.1:8037               │ 
 │       (bound on host 0.0.0.0 and port 8037)       │ 
 │                                                   │ 
 │ Handlers ............ 12  Processes ........... 1 │ 
 │ Prefork ....... Disabled  PID ............ 120438 │ 
 └───────────────────────────────────────────────────┘ 
```
