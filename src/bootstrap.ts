// load env variables
import { config as loadConfig } from 'dotenv'
loadConfig()

import { config, initEnv } from './common/config/config'
import siAbi from './contracts/sakeinu/abi.json'
import routerAbi from './contracts/dragonswap/router.json'

import wallet from './common/wallet'
import { ethers } from 'ethers'

import { Command } from './commands/interface'

import { CommandHandler } from './commands'
import { SakeInuCommandHandler } from './commands/sakeinu/handler'
import { SakeInuMaxApprove } from './commands/sakeinu/maxApprove'
import { SakeInu } from './contracts/sakeinu'

import { DragonSwapRouter } from './contracts/dragonswap/router'

import { SakeInuSetNonNFTAccount } from './commands/sakeinu/setERC721Exemption'

import {
  DragonSwapCommandHandler,
  DragonSwapBalances,
  DragonSwapAddLiquidity,
  DragonSwapBuy,
  DragonSwapSellForSEI,
  DragonSwapBuyForSAKEINU,
  DragonSwapSell,
} from './commands/dragonswap'
import {
  SakeInuIsLocked,
  SakeInuLockERC721,
  SakeInuUnlockERC721,
} from './commands/sakeinu'
import {
  WalletCommandHandler,
  WalletCreate,
  WalletMnemonic,
} from './commands/wallet'
import { WalletPrivateKey } from './commands/wallet/privateKey'

function init() {
  initEnv()
  wallet.init()
}

function dragonSwapInit(): Command {
  const dsRouterContract = new ethers.Contract(
    config.dsConfig.router,
    routerAbi,
    wallet.instance(),
  )

  const dsRouter = new DragonSwapRouter(dsRouterContract)
  // TODO: add more commands
  const dsCommands: Command[] = [
    new DragonSwapBuy(dsRouter),
    new DragonSwapBuyForSAKEINU(dsRouter),
    new DragonSwapSell(dsRouter),
    new DragonSwapSellForSEI(dsRouter),
    new DragonSwapBalances(),
    new DragonSwapAddLiquidity(dsRouter),
  ]
  return new DragonSwapCommandHandler(dsCommands)
}

function sakeInuInit(): Command {
  const siContract = new ethers.Contract(
    config.sakeInu,
    siAbi,
    wallet.instance(),
  )
  const si = new SakeInu(siContract)

  const siCommands: Command[] = [
    new SakeInuMaxApprove(si),
    new SakeInuSetNonNFTAccount(si),
    new SakeInuLockERC721(si),
    new SakeInuIsLocked(si),
    new SakeInuUnlockERC721(si),
  ]
  return new SakeInuCommandHandler(siCommands)
}

function walletInit(): Command {
  const walletCommands: Command[] = [
    new WalletCreate(),
    new WalletMnemonic(),
    new WalletPrivateKey(),
  ]
  return new WalletCommandHandler(walletCommands)
}

export async function bootstrap(
  isWallet: boolean = false,
): Promise<CommandHandler> {
  let commands: Command[] = [walletInit()]
  if (!isWallet) {
    init()
    commands = commands.concat([sakeInuInit(), dragonSwapInit()])
  }

  const commandHandler = new CommandHandler(
    '',
    'cli tools for SAKEINU(si), DragonSwap(ds) and Wallet(wallet)',
    '<command> <subcommand> <args...> ',
    commands,
  )

  return commandHandler
}
