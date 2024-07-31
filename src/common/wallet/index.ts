import { ethers } from 'ethers'
import { config } from '../config/config'
import { createHDWallet, load } from './wallet'

export let wallet: ethers.Wallet | ethers.HDNodeWallet

export function initWallet() {
  const wc = config.walletConfig
  if (!wc) {
    throw new Error('Wallet config is missing')
  }
  if (!wc.name && !wc?.mnemonic && !wc?.privateKey) {
    throw new Error('WALLET_NAME, WALLET_MNEMONIC or WALLET_PRIVATE_KEY is required')
  }

  if (wc.name) {
    console.log(`Loading wallet ${wc.name}`)
    wallet = load(wc.name, wc.password)
    if (wallet === undefined) {
      console.warn(`Wallet ${wc.name} not found`)
    }
  }

  if (!config.ethConfig.rpcUrl) {
    throw new Error('No rpc url found in config')
  }
  const provider = new ethers.JsonRpcProvider(config.ethConfig.rpcUrl)

  if (wc?.mnemonic) {
    console.log(`Creating HD wallet from mnemonic`)
    wallet = createHDWallet(wc.mnemonic, wc.password).connect(provider)
  }

  if (wc?.privateKey) {
    if (wc?.mnemonic) {
      console.warn(
        'Both the mnemonic and private key are provided, using the PRIVATE KEY',
      )
    }
    wallet = new ethers.Wallet(wc.privateKey, provider)
  }
}
