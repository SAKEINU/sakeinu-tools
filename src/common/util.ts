import { TransactionResponse } from 'ethers'
import password from '@inquirer/password'

export function printTx(tx: TransactionResponse) {
  console.log(
    `hash: ${tx.hash}, txIndex: ${tx.index}, blockNumber: ${tx.blockNumber}, from: ${tx.from}, nonce: ${tx.nonce}`,
  )
}

export async function askSecrets(query: string): Promise<string> {
  return await password({ message: query, mask: '*' })
}
