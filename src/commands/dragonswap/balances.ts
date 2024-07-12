import { formatUnits } from 'ethers'
import { Command } from '../interface'

import { config } from '../../common/config/config'
import { balances } from '../../common/dragonswap/utils'
import { wallet } from '../../common/wallet'

export class DragonSwapBalances implements Command {
  readonly command: string = 'balance'
  readonly description = 'Get the balances of pool and user'
  readonly help = '<address-optional>'

  constructor() {}

  async run(): Promise<boolean> {
    const res = await balances(
      config.ethConfig.rpcUrl,
      config.sakeInu,
      config.dsConfig.wsei,
      config.dsConfig.pair,
      wallet.address,
    )

    console.log(
      `User SEI: ${formatUnits(BigInt(res.userSEI), 18)}, SAKEINU: ${formatUnits(BigInt(res.userSAKEINU), 18)}`,
    )
    console.log(
      `Pair WSEI: ${formatUnits(BigInt(res.pairWSEI), 18)}, SAKEINU: ${formatUnits(BigInt(res.pairSAKEINU), 18)}`,
    )
    console.log('--------------------------------')
    return true
  }
}
