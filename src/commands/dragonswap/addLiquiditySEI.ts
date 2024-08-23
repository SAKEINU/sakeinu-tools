import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { Command } from '../interface'
import { config } from '../../common/config/config'
import { parseUnits } from 'ethers'
import { printTx } from '../../common/util'
import wallet from '../../common/wallet'
export class DragonSwapAddLiquidity implements Command {
  readonly command: string = 'addLiquiditySEI'
  readonly description = `addLiquiditySEI <amountTokenDesired> <amountTokenMin> <amountSEIMin> <to-optional default is wallet address>`
  readonly help =
    '<sakeinuDesired> <sakeinuMin> <amountSEIMin> <to-optional default is wallet address>'

  constructor(private readonly ds: DragonSwapRouter) {}

  async run(args: any[]): Promise<boolean> {
    if (args.length < 3) {
      console.error(this.command, ' ', this.help)
      return false
    }
    const deadline =
      Math.floor(Date.now() / 1000) + config.dsConfig.deadlineSeconds
    const tx = await this.ds.addLiquiditySEI(
      config.sakeInu,
      parseUnits(args[0], 18),
      parseUnits(args[1], 18),
      parseUnits(args[2], 18),
      args[3] ?? wallet.instance().address,
      deadline,
    )
    printTx(tx)
    return true
  }
}
