import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { Command } from '../interface'
import { config } from '../../common/config/config'
export class DragonSwapAddLiquidity implements Command {
  readonly command: string = 'addLiquiditySEI'
  readonly description = `addLiquiditySEI <token> <amountTokenDesired> <amountTokenMin> <amountSEIMin> <to>`
  readonly help =
    '<token> <amountTokenDesired> <amountTokenMin> <amountSEIMin> <to>'

  constructor(private readonly ds: DragonSwapRouter) {}

  async run(args: any[]): Promise<boolean> {
    if (args.length !== 5) {
      console.error(this.help)
      return false
    }
    const deadline =
      Math.floor(Date.now() / 1000) + config.dsConfig.deadlineSeconds
      console.log('args', args)
    const tx = await this.ds.addLiquiditySEI(
      args[0],
      args[1],
      args[2],
      args[3],
      args[4],
      deadline,
    )
    console.log(
      `hash: ${tx.hash}, from:${tx.from}, to:${tx.to} value:${tx.value.toString()}`,
    )
    return true
  }
}
