// load env variables
import { config as loadConfig } from 'dotenv'
loadConfig()

import { config, initEnv } from './common/config/config'
initEnv()

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

import { run as runCli } from './utils/cli-interaction'
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

function init() {
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

async function bootstrap() {
  init()
  const commandHandler = new CommandHandler(
    '',
    'cli tools for SAKEINU(si) and DragonSwap(ds)',
    '<command> <subcommand> <args...> ',
    [dragonSwapInit(), sakeInuInit()],
  )

  console.log(commandHandler.description)
  await runCli(commandHandler)
}

bootstrap()
  .then()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
