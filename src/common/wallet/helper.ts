import keystore from './keystore'
import { HDNodeWallet, Wallet } from 'ethers'

function isHDNodeWallet(wallet: Wallet | HDNodeWallet): wallet is HDNodeWallet {
  return (
    'mnemonic' in wallet &&
    typeof (wallet as HDNodeWallet).derivePath === 'function'
  )
}

function isStandardWallet(wallet: Wallet | HDNodeWallet): wallet is Wallet {
  return 'privateKey' in wallet && !('mnemonic' in wallet)
}

function createHDWallet(mnemonic?: string, password?: string): HDNodeWallet {
  if (!mnemonic) {
    console.warn(`Creating a new random wallet`)
    return HDNodeWallet.createRandom(password)
  }
  console.log(`Creating HD wallet from mnemonic`)
  return HDNodeWallet.fromPhrase(mnemonic, password)
}

function deriveChild(wallet: HDNodeWallet, index: number): HDNodeWallet {
  return wallet.deriveChild(index)
}

function load(
  name: string,
  password: string = '',
): HDNodeWallet | Wallet | undefined {
  const jsonKey = keystore.getWalletKey(name)
  if (!jsonKey) {
    console.error(`Wallet with name ${name} not found`)
    return undefined
  }
  return Wallet.fromEncryptedJsonSync(jsonKey, password)
}

function save(
  name: string,
  wallet: HDNodeWallet | Wallet,
  password: string = '',
): boolean {
  return keystore.addWalletToKeystore(
    name,
    Buffer.from(wallet.encryptSync(password)).toString('base64'),
  )
}

export default {
  isHDNodeWallet,
  isStandardWallet,
  createHDWallet,
  deriveChild,
  load,
  save,
}
