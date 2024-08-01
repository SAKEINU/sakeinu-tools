import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { Command } from '../interface'
import { config } from '../../common/config/config'
import { parseUnits } from 'ethers'

import wallet from '../../common/wallet'
import { DragonSwapRouterMixin } from './mixin'
export class DragonSwapBuyForSAKEINU
  extends DragonSwapRouterMixin
  implements Command
{
  readonly command: string = 'buyForSAKEINU'
  readonly description = `buyForSAKEINU <sakeinuAmountOut>`
  readonly help = '<sakeinuAmountOut>'

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

    const sakeinuExactAmountOut = parseUnits(args[0], 18)
    const { amountInMax } = this.calculateForExactOut(
      pairWSEI,
      pairSAKEINU,
      sakeinuExactAmountOut,
    )

    this.printExactOut(amountInMax, sakeinuExactAmountOut)
    await this.send('swapSEIForExactTokens', [
      sakeinuExactAmountOut,
      amountInMax,
      [config.dsConfig.wsei, config.sakeInu],
      wallet.instance().address,
      Math.floor(Date.now() / 1000) + config.dsConfig.deadlineSeconds,
    ])

    return true
  }
}
