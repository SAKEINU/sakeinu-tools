import { Command } from '../interface'
import wallet from '../../common/wallet/helper'
import { askQuestion } from '../../common/util'

export class WalletCreate implements Command {
  readonly command: string = 'create'
  readonly description = 'create <name>'
  readonly help = '<name>'

  constructor() {}

  async run(args: any[]): Promise<boolean> {
    if (args.length < 1) {
      console.log('Please provide a name for the wallet')
      return false
    }

    const mnemonic = await askQuestion('Enter your mnemonic: ')
    const password = await askQuestion('Enter your password: ')
    const name = args[0]
    const wlt = wallet.createHDWallet(mnemonic, password)
    wallet.save(name, wlt)
    return true
  }
}
