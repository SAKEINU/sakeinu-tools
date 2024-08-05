# SAKEINU Tools

SAKEINU tools for DEX and token contract management.

## Prerequisites

Before you begin, ensure you have installed Yarn on your system. If you haven't installed Yarn, follow the instructions on the [Yarn Installation Page](https://classic.yarnpkg.com/en/docs/install).

## Installation

Clone the repository and navigate into the project directory:

```sh
git clone https://github.com/SAKEINU/sakeinu-tools.git
cd sakeinu-tools
```

## Install the project dependencies using Yarn:

```sh
yarn install
```

## Linting
To lint the project, ensuring code quality and style consistency, use:

```sh
yarn lint
```


## Running the Project
To build and run the project, use:
```sh
yarn start
```


## Installing the Tool (sicli)
To install the `sicli` command-line interface globally on your system, run:
```sh
yarn build
yarn link
```


## Usage
After installing the sicli CLI tool, you can use it to interact with SAKEINU and DragonSwap functionalities. Below are examples of commands you can use, categorized by their respective functionalities.


### environment variables
make `.env` file based on `.env.example` file and fill the values

```sh
# Network
CHAIN_ID=<CHAIN_ID>
RPC_NODE=<EVM_RPC_NODE>

# Wallet
## Must provide either `WALLET_NAME`, `WALLET_MNEMONIC` or `WALLET_PRIVATE_KEY`
### WALLET_MNEMONIC is preferred, if you provide WALLET_PRIVATE_KEY, WALLET_MNEMONIC will be ignored
WALLET_MNEMONIC=
WALLET_INDEX= # Optional default is 0 you must choose HD wallet or provide mnemonic

WALLET_PRIVATE_KEY=

WALLET_NAME=<YOUR_SAVED_WALLET_NAME> # Optional provide when you want to named wallet from the keystore, default is default
WALLET_PASSWORD=<WALLET_PASSWORD_FOR_ENCRYPTION_AND_DECRYPTION> # Optional default is empty string

# DragonSwap
DS_PAIR=<DRAGONSWAP_PAIR_ADDRESS>
DS_ROUTER=<DRAGONSWAP_ROUTER_ADDRESS>
DS_SLIPPAGE=<SLIPPAGE>
DS_DEADLINE=<TRANSACTION_DEADLINE_IN_SECONDS>

# SAKEINU
SI_SAKEINU=<SAKEINU_ADDRESS>
```

#### Wallet load priority
1. Private key based wallet
2. mnemonic based wallet
3. named wallet from keystore

Do not provide multiple wallet options at the same time, it will make unexpected behavior.

e.g.)
- if you provide `WALLET_MNEMONIC` and `WALLET_PRIVATE_KEY` at the same time, it will use `WALLET_PRIVATE_KEY` only.
- if you provide `WALLET_NAME` and `WALLET_MNEMONIC` at the same time, it will use `WALLET_MNEMONIC` only.

### Example Usage of `sicli` Commands
To interact with the DragonSwap and SAKEINU functionalities, you use the `sicli`  followed by specific commands(`ds`, `si`). Here are examples based on the commands implemented in your workspace.

commands and arguments are separated by space.

```sh
# example
sicli si setNonNFTAcc 0xa4cF2F53D1195aDDdE9e4D3aCa54f556895712f2 true
```

```sh
# help
sicli help

# output
#  <wallet> <<help|commands> for subcommand(s)>
#  <si> <<help|commands> for subcommand(s)>
#  <ds> <<help|commands> for subcommand(s)>
```


Wallet commands:
```sh
sicli wallet help
#  <wallet> <create> <<name> <type-optional ETHER | SEI default is ETHER>>
#  <wallet> <mnemonic> <<name>>
#  <wallet> <privateKey> <<name> <index>>

DragonSwap commands:
```sh
# help for ds
sicli ds help

# output
#  <ds> <buy> <<seiAmountIn>>
#  <ds> <buyForSAKEINU> <<sakeinuAmountOut>>
#  <ds> <sell> <<sakeinuAmountIn>>
#  <ds> <sellForSEI> <<seiAmountOut>>
#  <ds> <balance> <<address-optional>>
#  <ds> <addLiquiditySEI> <<sakeinuDesired> <sakeinuMin> <amountSEIMin> <to>>
```

SAKEINU commands:
```sh
# help for si
sicli si help
# output
#  <si> <approveMax> <<address-optional> default is DS Router>
#  <si> <setNonNFTAcc> <<address> <true/false>>
```
