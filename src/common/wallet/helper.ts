import keystore from './keystore'
import {
  defaultPath,
  getIndexedAccountPath,
  HDNodeWallet,
  Mnemonic,
  Wallet,
} from 'ethers'

type HDPathType = 'ETHER' | 'SEI'

const hdPathType = {
  ETHER: defaultPath,
  SEI: `m/44'/118'/0'/0/`,
}

function isHDNodeWallet(wallet: Wallet | HDNodeWallet): wallet is HDNodeWallet {
  return typeof (wallet as HDNodeWallet).derivePath === 'function'
}

function isStandardWallet(wallet: Wallet | HDNodeWallet): wallet is Wallet {
  return 'privateKey' in wallet && !('mnemonic' in wallet)
}

function createHDWalletFromPhrase(
  phrase?: string,
  index = 0,
  walletType: HDPathType = 'ETHER',
): HDNodeWallet {
  if (!phrase) {
    console.warn(`Creating a new random wallet`)
    return HDNodeWallet.createRandom()
  }

  if (hdPathType[walletType] === undefined) {
    throw new Error(`Invalid wallet typ ${walletType}`)
  }

  console.log(`Creating ${walletType} HD wallet from mnemonic`)
  const mnemonic = Mnemonic.fromPhrase(phrase)
  return HDNodeWallet.fromMnemonic(mnemonic, indexedAccountPath(walletType, index))
}

function deriveChild(wallet: HDNodeWallet, index: number): HDNodeWallet {
  if (isStandardWallet(wallet)) {
    throw new Error(`Cannot derive child from standard wallet`)
  }

  if (!wallet?.mnemonic?.phrase) {
    throw new Error(`Cannot derive child from wallet without mnemonic`)
  }

  return createHDWalletFromPhrase(
    wallet.mnemonic.phrase,
    index,
    wallet.path.startsWith(hdPathType.SEI) ? 'SEI' : 'ETHER',
  )
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


function indexedAccountPath(type: HDPathType, index: number): string {
  if (type === 'ETHER') {
    return getIndexedAccountPath(index)
  }
  if (type === 'SEI') {
    return `${hdPathType.SEI}${index}`
  }
  throw new Error(`Invalid HDPathType ${type}`)
}

export default {
  isHDNodeWallet,
  isStandardWallet,
  createHDWalletFromPhrase,
  deriveChild,
  load,
  save,
}
