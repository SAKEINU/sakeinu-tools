import { printTx } from '../../common/util'
import { SakeInu } from '../../contracts/sakeinu'
import { Command } from '../interface'

export class SakeInuUnlockERC721 implements Command {
  readonly command: string = 'unlockERC721'
  readonly description = 'unlockERC721 <id>'
  readonly help = '<id>'

  constructor(private readonly si: SakeInu) {}

  async run(args: any[]): Promise<boolean> {
    if (args.length !== 1) {
      console.error(this.help)
      return false
    }

    const tx = await this.si.unlockERC721(args[0])
    printTx(tx)
    return true
  }
}
