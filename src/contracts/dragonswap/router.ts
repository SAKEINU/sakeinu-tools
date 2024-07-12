import { ethers, ContractTransactionResponse } from 'ethers'

export class DragonSwapRouter {
  constructor(private readonly contract: ethers.Contract) {}

  async addLiquiditySEI(
    token: string,
    amountTokenDesired: string | bigint,
    amountTokenMin: string | bigint,
    amountSEIMin: string | bigint,
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
      { value: amountSEIMin },
    )
  }

  async swapExactSEIForTokens(
    // <amountOut> <path with comma separate> <to>
    // write the types for the arguments
    amountIn: string | bigint,
    amountOut: string | bigint,
    path: string[],
    to: string,
    deadline: number,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.swapExactSEIForTokens(
      amountOut,
      path,
      to,
      deadline,
      { value: amountIn },
    )
  }

  async swapTokensForExactSEI(
    // <amountOut> <path with comma separate> <to>
    // write the types for the arguments
    amountOut: string | bigint,
    amountInMax: string | bigint,
    path: string[],
    to: string,
    deadline: number,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.swapTokensForExactSEI(
      amountOut,
      amountInMax,
      path,
      to,
      deadline,
    )
  }
}
