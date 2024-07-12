import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { Command } from '../interface'
import { config } from '../../common/config/config'
import { parseUnits } from 'ethers'

import { wallet } from '../../common/wallet'

import { DragonSwapRouterMixin } from './mixin'
export class DragonSwapBuy extends DragonSwapRouterMixin implements Command {
  readonly command: string = 'buy'
  readonly description = `buy <seiAmountIn>`
  readonly help = '<seiAmountIn>'

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

    const seiExactAmountIn = parseUnits(args[0], 18)
    const { amountOut, amountOutMin } = this.calculateForExactIn(
      pairWSEI,
      pairSAKEINU,
      seiExactAmountIn,
    )
    this.printExactIn(seiExactAmountIn, amountOut, amountOutMin)

    await this.send('swapExactSEIForTokens', [
      seiExactAmountIn,
      amountOutMin,
      [config.dsConfig.wsei, config.sakeInu],
      wallet.address,
      Math.floor(Date.now() / 1000) + config.dsConfig.deadlineSeconds,
    ])
    return true
  }
}
