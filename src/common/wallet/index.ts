import { ethers } from 'ethers'
import { config } from '../config/config'

export let wallet: ethers.Wallet

export function initWallet() {
  if (!config.ethConfig.privateKey) {
    throw new Error('No private key found in config')
  }

  if (!config.ethConfig.rpcUrl) {
    throw new Error('No rpc url found in config')
  }
  const provider = new ethers.JsonRpcProvider(config.ethConfig.rpcUrl)
  wallet = new ethers.Wallet(config.ethConfig.privateKey, provider)
}
