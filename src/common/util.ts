import { TransactionResponse } from 'ethers'

export function printTx(tx: TransactionResponse) {
  console.log(
    `hash: ${tx.hash}, txIndex: ${tx.index}, blockNumber: ${tx.blockNumber}, from: ${tx.from}, nonce: ${tx.nonce}`,
  )
}
