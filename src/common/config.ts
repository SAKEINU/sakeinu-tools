import { defaultConfig } from "./default.config"

export interface DragonSwapConfig {
    pair: string
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

let config: Config;
export function validateEnv() {

    config = {
        sakeInu: process.env.SAKE_INU || defaultConfig.sakeInu,
        ethConfig: {
            rpcUrl: process.env.RPC_URL || defaultConfig.ethConfig.rpcUrl,
            privateKey: process.env.PRIVATE_KEY || defaultConfig.ethConfig.privateKey,
            chainId: parseInt(process.env.CHAIN_ID || defaultConfig.ethConfig.chainId.toString())
        },
        dsConfig: {
            pair: process.env.PAIR || defaultConfig.dsConfig.pair,
            router: process.env.ROUTER || defaultConfig.dsConfig.router,
            slippage: parseFloat(process.env.SLIPPAGE || defaultConfig.dsConfig.slippage.toString()),
            deadlineSeconds: parseInt(process.env.DEADLINE_SECONDS || defaultConfig.dsConfig.deadlineSeconds.toString())
        }
    }

    // check required fields
    if (!config.sakeInu) {
        throw new Error('SAKE_INU is required')
    }

    if (!config.ethConfig.rpcUrl) {
        throw new Error('RPC_URL is required')
    }

    if (!config.ethConfig.privateKey) {
        throw new Error('PRIVATE_KEY is required')
    }

    if (!config.dsConfig.pair) {
        throw new Error('PAIR is required')
    }
}

export default config;
