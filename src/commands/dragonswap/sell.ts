import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { Command } from '../interface'
import { config } from '../../common/config/config'
import { parseUnits } from 'ethers'

import { wallet } from '../../common/wallet'
import { DragonSwapRouterMixin } from './mixin'
export class DragonSwapSell extends DragonSwapRouterMixin implements Command {
  readonly command: string = 'sell'
  readonly description = `sell <sakeinuAmountIn>`
  readonly help = '<sakeinuAmountIn>'

  constructor(ds: DragonSwapRouter) {
    super(ds)
  }

  async run(args: any[]): Promise<boolean> {
    const { pairWSEI, pairSAKEINU } = await super.prepare(
      args,
      1,
      this.command,
      this.help,
    )

    const sakeinuExactAmountIn = parseUnits(args[0], 18)
    const { amountOut, amountOutMin } = this.calculateForExactIn(
      pairSAKEINU,
      pairWSEI,
      sakeinuExactAmountIn,
    )
    this.printExactIn(sakeinuExactAmountIn, amountOut, amountOutMin)

    await this.send('swapExactTokensForSEI', [
      sakeinuExactAmountIn,
      amountOutMin,
      [config.sakeInu, config.dsConfig.wsei],
      wallet.address,
      Math.floor(Date.now() / 1000) + config.dsConfig.deadlineSeconds,
    ])
    return true
  }
}
