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
    console.error('Wallet is not set, may occur error')
  }

  if (wc.name) {
    // todo add path to keystore
    keystore.load()
    console.info(`Loading wallet ${wc.name} from the keystore`)
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
    if (wc?.name) {
      console.warn(
        'Both the wallet and mnemonic are provided, using the MNEMONIC',
      )
    }
    console.info(`Creating HD wallet from provided mnemonic`)
    instance = helper.createHDWalletFromPhrase(wc.mnemonic).connect(provider)
  }

  if (wc?.privateKey) {
    if (wc?.name) {
      console.warn(
        'Both the wallet and private key are provided, using the PRIVATE KEY',
      )
    }

    if (wc?.mnemonic) {
      console.warn(
        'Both the mnemonic and private key are provided, using the PRIVATE KEY',
      )
    }
    console.info(`Creating wallet from the provided private key`)
    instance = new ethers.Wallet(wc.privateKey, provider)
  }

  console.log(`wallet address: ${instance?.address}`)
  if (instance && wc.index) {
    if (helper.isStandardWallet(instance)) {
      throw new Error('Index is only supported for HD Wallet')
    }
    if (helper.isHDNodeWallet(instance)) {
      console.info(`Deriving wallet from HD wallet at index ${wc.index}`)
      instance = helper.deriveChild(instance, wc.index)
      console.log(`wallet address: ${instance.address}`)
    }
  }
}

function getInstance(): ethers.Wallet | ethers.HDNodeWallet {
  return instance
}

export default {
  init,
  instance: getInstance,
  helper,
  keystore,
}
