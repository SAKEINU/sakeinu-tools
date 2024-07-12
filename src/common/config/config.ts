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
  privateKey: string
}

export interface Config {
  sakeInu: string

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
      privateKey: process.env.PRIVATE_KEY || defaultConfig.ethConfig.privateKey,
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
  }

  if (!config.ethConfig.rpcUrl) {
    throw new Error('RPC_NODE is required')
  }

  if (!config.ethConfig.privateKey) {
    throw new Error('PRIVATE_KEY is required')
  }

  if (!config.dsConfig.router) {
    throw new Error('PAIR is required')
  }

  // check required fields
  if (!config.sakeInu) {
    throw new Error('SI_SAKEINU is required')
  }
}
