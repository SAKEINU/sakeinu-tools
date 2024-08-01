import { TransactionResponse } from 'ethers'
import readline from 'readline'
import { Writable } from 'stream'

export function printTx(tx: TransactionResponse) {
  console.log(
    `hash: ${tx.hash}, txIndex: ${tx.index}, blockNumber: ${tx.blockNumber}, from: ${tx.from}, nonce: ${tx.nonce}`,
  )
}

class MutableStream extends Writable {
  stdoutMuted: boolean = false

  _write(chunk: any, encoding: string, callback: () => void) {
    if (this.stdoutMuted) {
      process.stdout.write('*'.repeat(chunk.length))
    } else {
      process.stdout.write(chunk)
    }
    callback()
  }
}

export function askQuestion(query: string): Promise<string> {
  const wstream = new MutableStream()
  const rl = readline.createInterface({
    terminal: true,
    input: process.stdin,
    output: wstream,
  })

  wstream.stdoutMuted = false
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

// get input from the user and run the function by it.
// write a code
export function getInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(prompt, (input) => {
      rl.close()
      resolve(input)
    })
  })
}
