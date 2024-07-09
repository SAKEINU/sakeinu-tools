import { ethers, Contract } from 'ethers'

export class DragonSwapPair {
  private contract: Contract

  constructor(contract: ethers.Contract) {
    this.contract = contract
  }

  // Read
  async balanceOf(owner: ethers.AddressLike): Promise<ethers.BigNumberish> {
    return await this.contract.balanceOf(owner)
  }

  // Write
}
