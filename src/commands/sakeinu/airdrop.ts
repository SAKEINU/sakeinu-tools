import { readFileSync } from 'fs'
import { printTx } from '../../common/util'
import { SakeInu } from '../../contracts/sakeinu'
import { Command } from '../interface'
import { parseUnits } from 'ethers'

interface airdrop {
  address: string
  amount: string | number
}

interface seiAddrReq {
  sei_address: string
}
interface seiAddrRes {
  evm_address: string
  associated: boolean
}

export class SakeInuAirdrop implements Command {
  readonly command: string = 'airdrop'
  readonly description = 'airdrop <fileName>'
  readonly help = '<fileName>'

  constructor(private readonly si: SakeInu) {}

  async run(args: any[]): Promise<boolean> {
    if (args.length !== 1) {
      console.error(this.help)
      return false
    }

    // add current path with filename
    const data = readFileSync(`${process.cwd()}/${args[0]}`, 'utf-8')
    const airdrops: airdrop[] = JSON.parse(data)
    const restUrl = `https://rest.sei-apis.com/sei-protocol/seichain/evm/evm_address`
    for (const target of airdrops) {
      const req: seiAddrReq = { sei_address: target.address }
      const params = new URLSearchParams(req as any)

      const result = await fetch(`${restUrl}?${params.toString()}`)
      if (!result.ok) {
        console.error(`Error fetching address ${target.address}`)
        continue
      }
      const res: seiAddrRes = await result.json()
      if (res.associated === false) {
        console.error(`Address ${target.address} is not associated with SEI`)
        continue
      }

      console.log(
        `sending SAKE to ${res.evm_address}, amount: ${target.amount}`,
      )
      const tx = await this.si.transfer(
        target.address,
        parseUnits(target.amount.toString(), 18),
      )
      printTx(tx)
    }
    return true
  }
}
