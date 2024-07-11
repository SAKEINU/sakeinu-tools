import { ethers } from 'ethers'

export class DragonSwapPair {
  constructor(private readonly contract: ethers.Contract) {}

  // Read
  async balanceOf(owner: ethers.AddressLike): Promise<ethers.BigNumberish> {
    return await this.contract.balanceOf(owner)
  }

  // Write
}
