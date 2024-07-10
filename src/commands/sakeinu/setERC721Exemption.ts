import { dsConfig } from '../../common/config/default.config'
import { SakeInu } from '../../contracts/sakeinu'
import { Command } from '../interface'

export class SakeInuSetERC721Exemption implements Command {
  readonly command: string = 'setERC721Exemption'
  readonly description = 'setERC721Exemption <address> <state-boolean>'
  readonly help = '<address> <state true/false>'

  constructor(private readonly si: SakeInu) {}

  async run(args: any[]): Promise<boolean> {
    if (args.length !== 2) {
      console.error(this.help)
      return false
    }
    if (args[1] !== 'true' && args[1] !== 'false') {
      console.error(this.help)
      return false
    }

    const tx = await this.si.setERC721TransferExempt(
      args[0], args[1] === 'true',
    )
    console.log(tx.hash, tx.from, tx.to, tx.value.toString())
    return true
  }
}
