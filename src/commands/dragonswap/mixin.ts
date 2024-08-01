import { ContractTransactionResponse, formatUnits } from 'ethers'

import { config } from '../../common/config/config'
import {
  balances,
  calculateAmountInForExactOut,
  calculateAmountOutForExactIn,
} from '../../common/dragonswap/utils'
import wallet from '../../common/wallet'
import { DragonSwapRouter } from '../../contracts/dragonswap/router'
import { printTx } from '../../common/util'

interface Balance {
  userSEI: bigint
  userSAKEINU: bigint
  pairWSEI: bigint
  pairSAKEINU: bigint
}

interface SwapExactIn {
  amountOut: bigint
  amountOutMin: bigint
}

interface SwapExactOut {
  amountIn: bigint
  amountInMax: bigint
}

export class DragonSwapRouterMixin {
  constructor(private readonly ds: DragonSwapRouter) {}

  async prepare(
    args: any[],
    requiredArgsLen: number,
    command: string,
    help: string,
  ): Promise<Balance> {
    const { userSEI, userSAKEINU, pairWSEI, pairSAKEINU } = await balances(
      config.ethConfig.rpcUrl,
      config.sakeInu,
      config.dsConfig.wsei,
      config.dsConfig.pair,
      wallet.instance().address,
    )

    const userInfo = `User SEI: ${formatUnits(BigInt(userSEI), 18)}, SAKEINU: ${formatUnits(BigInt(userSAKEINU), 18)}, slippage(${config.dsConfig.slippage})`
    const reserveInfo = `Pair Reserve WSEI: ${formatUnits(BigInt(pairWSEI), 18)}, SAKEINU: ${formatUnits(BigInt(pairSAKEINU), 18)}`

    if (args.length !== requiredArgsLen || args[0] === 'help') {
      console.error(`${userInfo}\n, ${reserveInfo}\n`, command, help)
      return null
    }
    console.log(`${userInfo}\n${reserveInfo}\n`)
    return {
      userSEI: BigInt(userSEI),
      userSAKEINU: BigInt(userSAKEINU),
      pairWSEI: BigInt(pairWSEI),
      pairSAKEINU: BigInt(pairSAKEINU),
    }
  }

  calculateForExactIn(
    reserveIn: bigint,
    reserveOut: bigint,
    exactAmountIn: bigint,
  ): SwapExactIn {
    const amountOut = calculateAmountOutForExactIn(
      reserveIn,
      reserveOut,
      exactAmountIn,
    )
    const amountOutMin =
      (amountOut * BigInt((1 - config.dsConfig.slippage) * 1000)) / 1000n
    return {
      amountOut,
      amountOutMin,
    }
  }

  calculateForExactOut(
    reserveIn: bigint,
    reserveOut: bigint,
    exactAmountOut: bigint,
  ): SwapExactOut {
    const amountIn = calculateAmountInForExactOut(
      reserveIn,
      reserveOut,
      exactAmountOut,
    )
    const amountInMax =
      (amountIn * BigInt(Math.round(1 + config.dsConfig.slippage) * 1000)) /
      1000n
    return {
      amountIn,
      amountInMax,
    }
  }

  printExactIn(
    amountIn: string | bigint,
    amountOut: string | bigint,
    amountOutMin: string | bigint,
  ) {
    console.log(
      `amountIn(${formatUnits(amountIn, 18)}), amountOut(${formatUnits(amountOut, 18)}) amountOutMin(${formatUnits(amountOutMin)})`,
    )
  }

  printExactOut(amountInMax: string | bigint, amountOut: string | bigint) {
    console.log(
      `amountInMax: ${formatUnits(amountInMax, 18)} amountOut: ${formatUnits(amountOut, 18)}`,
    )
  }

  async send(funcName: string, args: any[]) {
    const tx = await this.ds[funcName](...args)
    this.postTx(tx)
  }

  postTx(tx: ContractTransactionResponse) {
    printTx(tx)
  }
}
