import { defaultConfig } from './default.config'

export interface DragonSwapConfig {
  pair: string
  wsei: string
  router?: string
  slippage: number
  deadlineSeconds: number
}

export interface EthConfig {
  rpcUrl: string
  chainId: number
}

export interface WalletConfig {
  mnemonic?: string
  password?: string
  index?: number
  privateKey?: string
  name?: string
}

export interface Config {
  sakeInu: string

  walletConfig?: WalletConfig

  // network related
  ethConfig: EthConfig

  // DragonSwap related
  dsConfig: DragonSwapConfig
}

export let config: Config
export function initEnv() {
  config = {
    ethConfig: {
      rpcUrl: process.env.RPC_NODE || defaultConfig.ethConfig.rpcUrl,
      chainId: parseInt(
        process.env.CHAIN_ID || defaultConfig.ethConfig.chainId.toString(),
      ),
    },

    dsConfig: {
      pair: process.env.DS_PAIR || defaultConfig.dsConfig.pair,
      router: process.env.DS_ROUTER || defaultConfig.dsConfig.router,
      wsei: process.env.DS_WSEI || defaultConfig.dsConfig.wsei,
      slippage: parseFloat(
        process.env.SLIPPAGE || defaultConfig.dsConfig.slippage.toString(),
      ),
      deadlineSeconds: parseInt(
        process.env.DS_DEADLINE ||
          defaultConfig.dsConfig.deadlineSeconds.toString(),
      ),
    },

    sakeInu: process.env.SI_SAKEINU || defaultConfig.sakeInu,

    walletConfig: {
      index: process.env.WALLET_INDEX
        ? parseInt(process.env.WALLET_INDEX)
        : defaultConfig.walletConfig?.index,
      name: process.env.WALLET_NAME || defaultConfig.walletConfig?.name,
      password:
        process.env.WALLET_PASSWORD || defaultConfig.walletConfig?.password,
      mnemonic:
        process.env.WALLET_MNEMONIC || defaultConfig.walletConfig?.mnemonic,
      privateKey:
        process.env.WALLET_PRIVATE_KEY ||
        defaultConfig.walletConfig?.privateKey,
    },
  }

  if (!config.ethConfig.rpcUrl) {
    throw new Error('RPC_NODE is required')
  }

  if (
    !config.walletConfig?.name &&
    !config.walletConfig?.mnemonic &&
    !config.walletConfig?.privateKey
  ) {
    console.warn(
      `Wallet config is not set properly, you can't sign transactions`,
    )
  }

  if (!config.dsConfig.router) {
    throw new Error('PAIR is required')
  }

  // check required fields
  if (!config.sakeInu) {
    throw new Error('SI_SAKEINU is required')
  }
}
