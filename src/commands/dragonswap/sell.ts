import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { Command } from '../interface'
import { config } from '../../common/config/config'
import { formatUnits, parseUnits } from 'ethers'

import { wallet } from '../../common/wallet'
import {
  balances,
  calculateAmountOutForExactIn,
} from '../../common/dragonswap/utils'
export class DragonSwapSell implements Command {
  readonly command: string = 'sell'
  readonly description = `sell <sakeinuAmountIn>`
  readonly help = '<sakeinuAmountIn>'

  constructor(private readonly ds: DragonSwapRouter) {}

  async run(args: any[]): Promise<boolean> {
    const { userSAKEINU, pairWSEI, pairSAKEINU } = await balances(
      config.ethConfig.rpcUrl,
      config.sakeInu,
      config.dsConfig.wsei,
      config.dsConfig.pair,
      wallet.address,
    )
    const reserveInfo = `current reserve: WSEI(${formatUnits(BigInt(pairWSEI), 18)})-SAKEINU(${formatUnits(BigInt(pairSAKEINU), 18)})`

    if (args.length === 0 || args[0] === 'help') {
      console.error(`${reserveInfo}\n`, this.help)
      return false
    }

    const deadline =
      Math.floor(Date.now() / 1000) + config.dsConfig.deadlineSeconds
    const exactAmountIn = parseUnits(args[0], 18)

    if (BigInt(userSAKEINU) < exactAmountIn) {
      console.error(
        `Insufficient SAKEINU balance: required ${formatUnits(exactAmountIn, 18)}, but got ${formatUnits(BigInt(userSAKEINU), 18)}`,
      )
      return false
    }

    const amountOut = calculateAmountOutForExactIn(
      BigInt(pairSAKEINU),
      BigInt(pairWSEI),
      exactAmountIn,
    )

    const amountOutMin =
      (amountOut * BigInt((1 - config.dsConfig.slippage) * 1000)) / 1000n
    const owner = wallet.address

    console.log(
      `${reserveInfo}\namountIn(${args[0]}), amountOut ${formatUnits(amountOut, 18)} amountOutMin(${formatUnits(amountOutMin, 18)}), slippage(${config.dsConfig.slippage})`,
    )
    const tx = await this.ds.swapExactTokensForSEI(
      exactAmountIn,
      amountOutMin,
      [config.sakeInu, config.dsConfig.wsei],
      owner,
      deadline,
    )
    console.log(tx.hash)
    return true
  }
}
