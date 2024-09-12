import { readFileSync, writeFileSync } from 'fs'
import { SakeInu } from '../../contracts/sakeinu'
import { Command } from '../interface'
import { parseUnits } from 'ethers'

interface airdrop {
  address: string
  amount: string
  hash?: string
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

    const filePath = `${process.cwd()}/${args[0]}`
    const data = readFileSync(filePath, 'utf-8')
    const airdrops: airdrop[] = JSON.parse(data)
    const evmAddresses: string[] = new Array(airdrops.length)
    const restUrl = `https://rest.sei-apis.com/sei-protocol/seichain/evm/evm_address`

    // prepare evm addresses
    console.log('Prepare evm address...')
    for (let i = 0; i < airdrops.length; i++) {
      const target = airdrops[i]
      if (target.hash) {
        continue
      }

      const params = new URLSearchParams({ sei_address: target.address })
      let res: seiAddrRes
      try {
        const result = await fetch(`${restUrl}?${params.toString()}`)
        if (!result.ok) {
          console.error(`Error fetching address ${target.address}`)
          // sleep
          await new Promise((resolve) => setTimeout(resolve, 1000))
          i--
          continue
        }
        res = await result.json()
        if (res.associated === false) {
          console.warn(`${i + 1} Address ${target.address} is not associated`)
          continue
        }
      } catch (err) {
        console.error(`Error fetching address ${target.address}`)
        i--
      }
      evmAddresses[i] = res.evm_address
    }

    if (evmAddresses.length !== airdrops.length) {
      console.error('Error fetching addresses')
      return false
    }

    // start airdrop
    console.log('Sending SAKE...')
    for (let i = 0; i < airdrops.length; i++) {
      const target = airdrops[i]
      const evmAddress = evmAddresses[i]
      if (target.hash) {
        console.log(`${i + 1} Skipping ${target.address}`)
        continue
      }
      if (!evmAddress) {
        console.log(
          `${i + 1} ${target.address} is not associated with an EVM address, skipping`,
        )
        continue
      }

      try {
        const tx = await this.si.transfer(
          target.address,
          parseUnits(target.amount.toString(), 18),
        )

        // Wait for the transaction to be mined
        const receipt = await tx.wait()
        if (receipt.status !== 1) {
          console.error(`Transaction failed: ${receipt.hash}`)
          i--
          await new Promise((resolve) => setTimeout(resolve, 1000))
          continue
        }

        // success
        target.hash = receipt.hash
        console.log(
          `${i + 1} Sent SAKE to ${target.address}(${evmAddress}), amount: ${target.amount}, tx: ${target.hash}`,
        )
      } catch (err) {
        console.error(`Error sending SAKE to ${target.address}(${evmAddress})`)
        break
      }
    }

    const updatedData = JSON.stringify(airdrops, null, 2)
    writeFileSync(filePath, updatedData)

    return true
  }
}
