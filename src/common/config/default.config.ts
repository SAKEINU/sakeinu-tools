import { dsInfo } from '../../commands/dragonswap/const'
import { Config, DragonSwapConfig, EthConfig } from './config'

export const PACIFIC_CHAIN_ID = 1329
export const ARCTIC_CHAIN_ID = 713715

export const dsConfig: DragonSwapConfig = {
  pair: '',
  router: dsInfo.Router,
  slippage: 0.005,
  deadlineSeconds: 60,
}

export const ethConfig: EthConfig = {
  rpcUrl: 'https://evm-rpc-arctic-1.sei-apis.com/',
  chainId: ARCTIC_CHAIN_ID,
  privateKey: '',
}

export const defaultConfig: Config = {
  sakeInu: '',
  ethConfig,
  dsConfig,
}
