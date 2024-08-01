import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { Command } from '../interface'
import { config } from '../../common/config/config'
import { parseUnits } from 'ethers'

import wallet from '../../common/wallet'

import { DragonSwapRouterMixin } from './mixin'
export class DragonSwapSellForSEI
  extends DragonSwapRouterMixin
  implements Command
{
  readonly command: string = 'sellForSEI'
  readonly description = `sellForSEI <seiAmountOut>`
  readonly help = '<seiAmountOut>'

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

    const seiExactAmountOut = parseUnits(args[0], 18)
    const { amountInMax } = this.calculateForExactOut(
      pairSAKEINU,
      pairWSEI,
      seiExactAmountOut,
    )

    await this.send('swapTokensForExactSEI', [
      seiExactAmountOut,
      amountInMax,
      [config.sakeInu, config.dsConfig.wsei],
      wallet.instance().address,
      Math.floor(Date.now() / 1000) + config.dsConfig.deadlineSeconds,
    ])
    return true
  }
}
