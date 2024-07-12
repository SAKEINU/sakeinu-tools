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

  async swapExactTokensForSEI(
    amountIn: string | bigint,
    amountOut: string | bigint,
    path: string[],
    to: string,
    deadline: number,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.swapExactTokensForSEI(
      amountIn,
      amountOut,
      path,
      to,
      deadline,
    )
  }

  async swapTokensForExactSEI(
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

  async swapSEIForExactTokens(
    amountOut: string | bigint,
    amountInMax: string | bigint,
    path: string[],
    to: string,
    deadline: number,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.swapSEIForExactTokens(
      amountOut,
      path,
      to,
      deadline,
      { value: amountInMax },
    )
  }
}
