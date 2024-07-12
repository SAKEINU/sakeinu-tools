#!/usr/bin/env node

// load env variables
import { config as loadConfig } from 'dotenv'
loadConfig()

import { config, initEnv } from './common/config/config'
initEnv()

import siAbi from './contracts/sakeinu/abi.json'
import routerAbi from './contracts/dragonswap/router.json'

import { wallet, initWallet } from './common/wallet'
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

function init() {
  initWallet()
}

function dragonSwapInit(): Command {
  const dsRouterContract = new ethers.Contract(
    config.dsConfig.router,
    routerAbi,
    wallet,
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
  const siContract = new ethers.Contract(config.sakeInu, siAbi, wallet)
  const si = new SakeInu(siContract)

  const siCommands: Command[] = [
    new SakeInuMaxApprove(si),
    new SakeInuSetNonNFTAccount(si),
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

  const userInput = process.argv.slice(2)
  commandHandler.run(userInput)
}

bootstrap()
  .then()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
