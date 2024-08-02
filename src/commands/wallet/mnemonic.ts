import { Command } from '../interface'
import wallet from '../../common/wallet/helper'
import { askSecrets } from '../../common/util'

export class WalletMnemonic implements Command {
  readonly command: string = 'mnemonic'
  readonly description = 'mnemonic <name>'
  readonly help = '<name>'

  constructor() {}

  async run(args: any[]): Promise<boolean> {
    if (args.length < 1) {
      console.log('Please provide a name for the wallet')
      return false
    }

    const name = args[0]
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
    console.log(wlt.mnemonic)
    return true
  }
}
