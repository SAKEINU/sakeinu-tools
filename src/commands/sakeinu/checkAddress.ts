import { readFileSync } from 'fs'
import { SakeInu } from '../../contracts/sakeinu'
import { Command } from '../interface'

interface airdrop {
  address: string
}

interface seiAddrReq {
  sei_address: string
}
interface seiAddrRes {
  evm_address: string
  associated: boolean
}

export class SakeInuCheckAddress implements Command {
  readonly command: string = 'checkAddress'
  readonly description = 'checkAddress <fileName>'
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

      console.log(`sending SAKE from ${target.address} to ${res.evm_address}`)
    }
    return true
  }
}
