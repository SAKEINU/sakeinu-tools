import { ethers, Contract, ContractTransactionResponse } from 'ethers'

export class DragonSwapRouter {

  constructor(private readonly contract: ethers.Contract) {
  }

  async addLiquiditySEI(
    token: string,
    amountTokenDesired: string,
    amountTokenMin: string,
    amountSEIMin: string,
    to: string,
    deadline: number,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.addLiquiditySEI(
      token,
      amountTokenDesired,
      amountTokenMin,
      amountSEIMin,
      to,
      deadline,
    )
  }
}
