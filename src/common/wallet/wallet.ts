import { HDNodeWallet, Wallet } from 'ethers'
import keystore from './keystore'

export function isHDNodeWallet(
  wallet: Wallet | HDNodeWallet,
): wallet is HDNodeWallet {
  return (
    'mnemonic' in wallet &&
    typeof (wallet as HDNodeWallet).derivePath === 'function'
  )
}

export function isStandardWallet(
  wallet: Wallet | HDNodeWallet,
): wallet is Wallet {
  return 'privateKey' in wallet && !('mnemonic' in wallet)
}

export function createHDWallet(
  mnemonic?: string,
  password?: string,
): HDNodeWallet {
  if (!mnemonic) {
    return HDNodeWallet.createRandom(password)
  }
  return HDNodeWallet.fromPhrase(mnemonic, password)
}

export function deriveChild(wallet: HDNodeWallet, index: number): HDNodeWallet {
  return wallet.deriveChild(index)
}

export function load(
  name: string,
  password: string = '',
): HDNodeWallet | Wallet | undefined {
  const encodedWallet = keystore.getWalletKey(name)
  if (!encodedWallet) {
    console.error(`Wallet with name ${name} not found`)
    return undefined
  }
  return Wallet.fromEncryptedJsonSync(encodedWallet, password)
}

export function save(
  name: string,
  wallet: HDNodeWallet | Wallet,
  password: string = '',
): boolean {
  return keystore.addWalletToKeystore(name, wallet.encryptSync(password))
}
