import { TransactionResponse } from 'ethers'
import readlineSync from 'readline-sync'

export function printTx(tx: TransactionResponse) {
  console.log(
    `hash: ${tx.hash}, txIndex: ${tx.index}, blockNumber: ${tx.blockNumber}, from: ${tx.from}, nonce: ${tx.nonce}`,
  )
}

export function askSecrets(query: string): string {
  return readlineSync.question(query, { hideEchoBack: true, mask: '*' })
}

// get input from the user and run the function by it.
// write a code
export function askInput(prompt: string): string {
  return readlineSync.question(prompt)
}
