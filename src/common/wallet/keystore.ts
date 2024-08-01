import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'

type Keystore = {
  [name: string]: string
}

let keystore: Keystore = {}
let keystoreFilePath: string = path.resolve(process.cwd(), 'keystore.json')
const initialized = false

// Function to read keystore from file
function load(filePath?: string, fileName?: string) {
  if (initialized) {
    return
  }

  keystoreFilePath = filePath
    ? path.resolve(filePath, fileName)
    : keystoreFilePath

  if (!existsSync(keystoreFilePath)) {
    console.warn(`there is no keystore file at ${keystoreFilePath}`)
    console.warn(`Creating keystore file at ${keystoreFilePath}`)
    writeKeystore()
    return
  }

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
    console.log(`Writing keystore to ${keystoreFilePath}`)
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
  console.log(keystore)
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
  let encodedKey = keystore[walletName]
  if (encodedKey) {
    encodedKey = Buffer.from(encodedKey, 'base64').toString('utf8')
  }
  return encodedKey
}

export default {
  load,
  writeKeystore,
  addWalletToKeystore,
  updateWalletInKeystore,
  getWalletKey,
}
