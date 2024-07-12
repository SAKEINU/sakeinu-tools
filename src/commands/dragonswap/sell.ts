import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { Command } from '../interface'
import { config } from '../../common/config/config'
import { formatUnits, parseUnits } from 'ethers'

import { wallet } from '../../common/wallet'
import {
  balances,
  calculateAmountInForExactOut,
} from '../../common/dragonswap/utils'
export class DragonSwapSellForSEI implements Command {
  readonly command: string = 'sellForSEI'
  readonly description = `sellForSEI <seiAmountOut>`
  readonly help = '<seiAmountOut>'

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
    const exactAmountOut = parseUnits(args[0], 18)
    const amountIn = calculateAmountInForExactOut(
      BigInt(pairSAKEINU),
      BigInt(pairWSEI),
      exactAmountOut,
    )
    const amountInMax =
      (amountIn * BigInt(Math.round(1 + config.dsConfig.slippage) * 1000)) /
      1000n

    if (BigInt(userSAKEINU) < amountInMax) {
      console.error(
        `Insufficient SAKEINU balance: required ${formatUnits(amountInMax, 18)}, but got ${formatUnits(BigInt(userSAKEINU), 18)}`,
      )
    }
    const owner = wallet.address

    console.log(
      `${reserveInfo}\namountInMax: ${formatUnits(amountInMax, 18)} amountOut: ${args[0]}, slippage(${config.dsConfig.slippage})`,
    )
    const tx = await this.ds.swapTokensForExactSEI(
      exactAmountOut,
      amountInMax,
      [config.sakeInu, config.dsConfig.wsei],
      owner,
      deadline,
    )
    console.log(tx.hash)
    return true
  }
}
