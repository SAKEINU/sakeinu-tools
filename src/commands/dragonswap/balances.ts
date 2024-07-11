import { formatUnits, JsonRpcProvider } from 'ethers'
import { Command } from '../interface'
import { balances } from './common'
import { config } from '../../common/config/config'

export class DragonSwapBalances implements Command {
  readonly command: string = 'balance'
  readonly description = 'Get the balances of pool and user'
  readonly help = '<address-optional>'

  constructor() {}

  async run(args: any[]): Promise<boolean> {
    const res = await balances(config.ethConfig.rpcUrl, args[0])

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
