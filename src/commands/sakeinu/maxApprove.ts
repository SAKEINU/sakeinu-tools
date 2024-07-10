import { dsConfig } from '../../common/config/default.config'
import { SakeInu } from '../../contracts/sakeinu'
import { Command } from '../interface'

export class SakeInuMaxApprove implements Command {
  readonly command: string = 'approveMax'
  readonly description = 'Approve Max token transfer'
  readonly help = '<address-optional> default is DS Router'

  constructor(private readonly si: SakeInu) {}

  async run(args: any[]): Promise<boolean> {
    let address = dsConfig.router
    if (args[0]) {
      address = args[0]
    }
    console.log('Approving max for', address)
    const tx = await this.si.approveERC20(
      address,
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    )
    console.log(tx.hash, tx.from, tx.to, tx.value.toString())
    return true
  }
}
