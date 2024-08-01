import { ethers } from 'ethers'
import { config } from '../config/config'
import helper from './helper'
import keystore from './keystore'

let instance: ethers.Wallet | ethers.HDNodeWallet | null = null

function init() {
  const wc = config.walletConfig
  if (!wc) {
    throw new Error('Wallet config is missing')
  }
  if (!wc.name && !wc?.mnemonic && !wc?.privateKey) {
    console.warn('Wallet is not set')
  }

  if (wc.name) {
    // todo add path to keystore
    keystore.load()
    console.log(`Loading wallet ${wc.name}`)
    instance = helper.load(wc.name, wc.password)
    if (instance == undefined) {
      console.warn(`Wallet ${wc.name} not found`)
    }
  }

  if (!config.ethConfig.rpcUrl) {
    throw new Error('No rpc url found in config')
  }
  const provider = new ethers.JsonRpcProvider(config.ethConfig.rpcUrl)

  if (wc?.mnemonic) {
    console.log(`Creating HD wallet from mnemonic`)
    instance = helper.createHDWallet(wc.mnemonic, wc.password).connect(provider)
  }

  if (wc?.privateKey) {
    if (wc?.mnemonic) {
      console.warn(
        'Both the mnemonic and private key are provided, using the PRIVATE KEY',
      )
    }
    console.log(`Creating wallet from private key`)
    instance = new ethers.Wallet(wc.privateKey, provider)
  }
}

function getInstance(): ethers.Wallet | ethers.HDNodeWallet {
  if (instance == null) {
    throw new Error('Wallet not initialized')
  }
  return instance
}

export default {
  init,
  instance: getInstance,
  helper,
  keystore,
}
