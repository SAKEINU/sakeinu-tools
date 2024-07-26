import { printTx } from '../../common/util'
import { SakeInu } from '../../contracts/sakeinu'
import { Command } from '../interface'
import { config } from '../../common/config/config'

export class SakeInuMaxApprove implements Command {
  readonly command: string = 'approveMax'
  readonly description = 'Approve Max token transfer'
  readonly help = '<address-optional> default is DS Router'

  constructor(private readonly si: SakeInu) {}

  async run(args: any[]): Promise<boolean> {
    let address = config.dsConfig.router
    if (args[0]) {
      address = args[0]
    }
    console.log('Approving max for', address)
    const tx = await this.si.approveERC20(
      address,
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    )
    printTx(tx)
    return true
  }
}
