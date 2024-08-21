import { Command } from '../interface'
import wallet from '../../common/wallet/helper'
import { askSecrets } from '../../common/util'

export class WalletPrivateKey implements Command {
  readonly command: string = 'privateKey'
  readonly description = 'privateKey <name> <index>'
  readonly help = '<name> <index>'

  constructor() {}

  async run(args: any[]): Promise<boolean> {
    if (args.length < 2) {
      console.warn('Please provide a {name} {index} for the wallet')
      return false
    }

    const name = args[0]
    const index = parseInt(args[1])
    const password = await askSecrets('Enter your password: ')
    const wlt = wallet.load(name, password)
    if (!wlt) {
      console.warn(`Wallet ${name} not found`)
      return false
    }

    if (!wallet.isHDNodeWallet(wlt)) {
      console.error('Wallet is not HD Wallet')
      return false
    }

    const w = wallet.deriveChild(wlt, index)
    console.log(`address: ${w.address}`)
    console.log(w.privateKey)
    return true
  }
}
