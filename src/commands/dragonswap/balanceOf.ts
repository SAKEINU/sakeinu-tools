import { DragonSwapPair } from '../../contracts/dragonswap/pair'
import { Command } from '../interface'

export class BalanceOfCommand implements Command {
  readonly command: string = 'balanceOf'
  readonly description = 'Get the balance of an address'
  readonly help = 'balanceOf address(as the first argument)'

  constructor(private readonly ds: DragonSwapPair) {}

  async run(args: any[]): Promise<boolean> {
    if (args.length !== 1) {
      console.error(this.help)
      return false
    }

    const address = args[0]
    const balance = await this.ds.balanceOf(address)
    console.log(balance.toString())
    return true
  }
}
