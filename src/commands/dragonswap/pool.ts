import { DragonSwapPair } from '../../contracts/dragonswap/pair'
import { Command } from '../interface'

export class BalanceOfCommand implements Command {
  readonly command: string = 'pool'
  readonly description = 'Get the balances of assets of a pool'
  readonly help = 'pool'

  constructor(private readonly ds: DragonSwapPair) {}

  async run(args: any[]): Promise<boolean> {
    // if (args.length !== 1) {
    //   console.error(this.help)
    //   return false
    // }

    // const address = args[0]
    // const balance = await this.ds.pool(address)
    // console.log(balance.toString())
    return true
  }
}