import { Config, DragonSwapConfig, EthConfig } from "./config"


const PACIFIC_CHAIN_ID = 1329;
const ARCTIC_CHAIN_ID = 713715;

export const dsConfig: DragonSwapConfig = {
    pair: '',
    router: '',
    slippage: 0.005,
    deadlineSeconds: 60
}

export const ethConfig: EthConfig = {
    rpcUrl: 'https://evm-rpc-arctic-1.sei-apis.com/',
    privateKey: '',
    chainId: 713715
}

export const defaultConfig: Config = {
    sakeInu: "",
    ethConfig,
    dsConfig,
}
