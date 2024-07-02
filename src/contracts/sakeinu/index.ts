import {
  ContractTransactionResponse,
  ethers,
  Contract,
  BigNumberish,
} from 'ethers'

export class SakeInu {
  private contract: Contract

  constructor(contract: ethers.Contract) {
    this.contract = contract
  }

  ///////////////////////////////////
  //  ERC20 Tx-related functions   //
  ///////////////////////////////////
  async transfer(
    recipient: string,
    amount: BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.transfer(recipient, amount)
  }

  async transferFromERC20(
    sender: string,
    recipient: string,
    amount: BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.erc20TransferFrom(sender, recipient, amount)
  }

  async approveERC20(
    spender: string,
    amount: BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.erc20Approve(spender, amount)
  }

  ////////////////////////////////////
  //    ERC20 Getter functions      //
  ////////////////////////////////////

  async totalSupply(): Promise<BigNumberish> {
    return await this.contract.totalSupply()
  }

  async erc20TotalSupply(): Promise<BigNumberish> {
    return await this.contract.erc20TotalSupply()
  }

  async balanceOf(owner: string): Promise<BigNumberish> {
    return await this.contract.balanceOf(owner)
  }

  async balanceOfERC20(owner: string): Promise<BigNumberish> {
    return await this.contract.erc20BalanceOf(owner)
  }

  async allowance(owner: string, spender: string): Promise<BigNumberish> {
    return await this.contract.allowance(owner, spender)
  }

  ////////////////////////////////////
  //    ERC721 Tx-related functions //
  ////////////////////////////////////

  async setSelfERC721TransferExempt(
    state: boolean,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.setSelfERC721TransferExempt(state)
  }

  async setApprovalForAll(
    operator_: string,
    approved_: boolean,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.setApprovalForAll(operator_, approved_)
  }

  async approveERC721(
    spender: string,
    id: BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.erc721Approve(spender, id)
  }

  async transferFromERC721(
    sender: string,
    recipient: string,
    id: BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.erc721TransferFrom(sender, recipient, id)
  }

  async lockERC721(id: BigNumberish): Promise<ContractTransactionResponse> {
    return await this.contract.erc721Lock(id)
  }

  async unlockERC721(id: BigNumberish): Promise<ContractTransactionResponse> {
    return await this.contract.erc721Unlock(id)
  }

  ////////////////////////////////////
  //    ERC721 Getter functions     //
  ////////////////////////////////////
  async ownerOf(tokenId: BigNumberish): Promise<string> {
    return await this.contract.ownerOf(tokenId)
  }

  async balanceOfERC721(owner: string): Promise<BigNumberish> {
    return await this.contract.erc721BalanceOf(owner)
  }

  async totalSupplyERC721(): Promise<BigNumberish> {
    return await this.contract.erc721TotalSupply()
  }

  async minted(): Promise<BigNumberish> {
    return await this.contract.minted()
  }

  async getApproved(id: BigNumberish): Promise<string> {
    return await this.contract.getApproved(id)
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.isApprovedForAll(owner, operator)
  }

  ////////////////////////////////////
  //    ERC404 Tx-related functions //
  ////////////////////////////////////

  async transferFromValueOrId(
    sender: string,
    recipient: string,
    valueOrId: BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.transferFrom(sender, recipient, valueOrId)
  }

  async safeTransferFromId(
    sender: string,
    recipient: string,
    id: BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.safeTransferFrom(sender, recipient, id)
  }

  async approveValueOrId(
    spender: string,
    valueOrId: BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.approve(spender, valueOrId)
  }

  ////////////////////////////////////
  //    ERC404 Getter functions     //
  ////////////////////////////////////

  async getERC721QueueLength(): Promise<BigNumberish> {
    return await this.contract.getERC721QueueLength()
  }

  async getERC721TokensInQueue(
    start_: BigNumberish,
    count_: BigNumberish,
  ): Promise<BigNumberish[]> {
    return await this.contract.getERC721TokensInQueue(start_, count_)
  }

  ///////////////////////////////////
  //       Owner functions         //
  ///////////////////////////////////

  async setBaseURI(newBaseURI: string): Promise<ContractTransactionResponse> {
    return await this.contract.setBaseURI(newBaseURI)
  }

  async setERC721TransferExempt(
    account: string,
    exempt: boolean,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.setERC721TransferExempt(account, exempt)
  }

  async setMaxERC721Transfer(
    value: BigNumberish,
  ): Promise<ContractTransactionResponse> {
    return await this.contract.setMaxERC721Transfer(value)
  }

  ///////////////////////////////////
  //       Getter functions        //
  ///////////////////////////////////

  async DOMAIN_SEPARATOR(): Promise<string> {
    return await this.contract.DOMAIN_SEPARATOR()
  }

  async ID_ENCODING_PREFIX(): Promise<BigNumberish> {
    return await this.contract.ID_ENCODING_PREFIX()
  }

  async baseURI(): Promise<string> {
    return await this.contract.baseURI()
  }

  async decimals(): Promise<number> {
    return await this.contract.decimals()
  }

  async name(): Promise<string> {
    return await this.contract.name()
  }

  async symbol(): Promise<string> {
    return await this.contract.symbol()
  }

  async erc721TransferExempt(account: string): Promise<boolean> {
    return await this.contract.erc721TransferExempt(account)
  }

  async nonces(owner: string): Promise<BigNumberish> {
    return await this.contract.nonces(owner)
  }

  async owned(owner_: string): Promise<BigNumberish[]> {
    return await this.contract.owned(owner_)
  }

  async owner(): Promise<string> {
    return await this.contract.owner()
  }

  async supportsInterface(interfaceId: string): Promise<boolean> {
    return await this.contract.supportsInterface(interfaceId)
  }

  async tokenURI(tokenId: BigNumberish): Promise<string> {
    return await this.contract.tokenURI(tokenId)
  }

  async isLocked(tokenId: BigNumberish): Promise<boolean> {
    return await this.contract.locked(tokenId)
  }

  async getLockedTokens(owner_: string): Promise<BigNumberish[]> {
    return await this.contract.lockedTokens(owner_)
  }

  async getMaxERC721Transfer(): Promise<BigNumberish> {
    return await this.contract.maxERC721Transfer()
  }
}
