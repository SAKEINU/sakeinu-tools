import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

type Keystore = {
  [name: string]: string
}

let keystore: Keystore = {}
let keystoreFilePath: string = path.resolve(__dirname, 'keystore.json')
const initialized = false

// Function to read keystore from file
function loadKeystore(filePath?: string, fileName?: string) {
  if (initialized) {
    return
  }

  keystoreFilePath = filePath
    ? path.resolve(filePath, fileName)
    : keystoreFilePath

  try {
    const data = readFileSync(keystoreFilePath, 'utf8')
    keystore = JSON.parse(data) as Keystore
  } catch (error) {
    console.error('Error reading keystore file:', error)
    throw error
  }
}

// Function to write keystore to file
function writeKeystore(): boolean {
  try {
    const data = JSON.stringify(keystore, null, 2)
    writeFileSync(keystoreFilePath, data, 'utf8')
    return true
  } catch (error) {
    console.error('Error writing keystore file:', error)
    return false
  }
}

// Add a new wallet to the keystore
function addWalletToKeystore(
  walletName: string,
  encodedWallet: string,
): boolean {
  if (keystore[walletName]) {
    console.error(
      'Wallet with the same name already exists in the keystore, use update',
    )
    return false
  }

  keystore[walletName] = encodedWallet
  writeKeystore()
  return true
}

function updateWalletInKeystore(
  walletName: string,
  encodedWallet: string,
): boolean {
  if (!keystore[walletName]) {
    console.error(
      'Wallet with the name does not exist in the keystore, use add',
    )
    return false
  }
  keystore[walletName] = encodedWallet
  return writeKeystore()
}

// Retrieve a wallet from the keystore
function getWalletKey(walletName: string): string | undefined {
  return keystore[walletName]
}

export default {
  loadKeystore,
  writeKeystore,
  addWalletToKeystore,
  updateWalletInKeystore,
  getWalletKey,
}
