import { printTx } from '../../common/util'
import { SakeInu } from '../../contracts/sakeinu'
import { Command } from '../interface'

export class SakeInuLockERC721 implements Command {
  readonly command: string = 'lockERC721'
  readonly description = 'lockERC721 <id>'
  readonly help = '<id>'

  constructor(private readonly si: SakeInu) {}

  async run(args: any[]): Promise<boolean> {
    if (args.length !== 1) {
      console.error(this.help)
      return false
    }

    const tx = await this.si.lockERC721(args[0])
    printTx(tx)
    return true
  }
}
