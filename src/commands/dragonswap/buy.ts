import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { Command } from '../interface'
import { config } from '../../common/config/config'
import { formatUnits, parseUnits } from 'ethers'
import { balances, calculateAmountOut } from './common'
import { wallet } from '../../common/wallet'
export class DragonSwapBuySAKEINU implements Command {
  readonly command: string = 'buy'
  readonly description = `buy <amountIn>`
  readonly help = '<amountIn>'

  constructor(private readonly ds: DragonSwapRouter) {}

  async run(args: any[]): Promise<boolean> {
    const { pairWSEI, pairSAKEINU } = await balances(config.ethConfig.rpcUrl)
    const reserveInfo = `current reserve: WSEI(${formatUnits(BigInt(pairWSEI), 18)})-SAKEINU(${formatUnits(BigInt(pairSAKEINU), 18)})`

    if (args.length === 0 || args[0] === 'help') {
      console.error(`${reserveInfo}\n`, this.help)
      return false
    }

    const deadline =
      Math.floor(Date.now() / 1000) + config.dsConfig.deadlineSeconds
    const amountIn = parseUnits(args[0], 18)
    const amountOut = calculateAmountOut(
      BigInt(pairWSEI),
      BigInt(pairSAKEINU),
      amountIn,
    )
    const amountOutMin =
      (amountOut * BigInt((1 - config.dsConfig.slippage) * 1000)) / 1000n
    const owner = wallet.address

    console.log(
      `${reserveInfo}\namountIn(${args[0]}), amountOut ${amountOut} amountOutMin(${amountOutMin}), slippage(${config.dsConfig.slippage})`,
    )
    const tx = await this.ds.swapExactSEIForTokens(
      amountIn,
      amountOutMin,
      [config.dsConfig.wsei, config.sakeInu],
      owner,
      deadline,
    )
    console.log(tx.hash)
    return true
  }
}
