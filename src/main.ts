// load env variables
import { config as loadConfig } from 'dotenv'
loadConfig()

import { config, initEnv } from './common/config/config'
initEnv()

import siAbi from './contracts/sakeinu/abi.json'
import pairAbi from './contracts/dragonswap/pair.json'
import routerAbi from './contracts/dragonswap/router.json'

import { wallet, initWallet } from './common/wallet'
import { ethers } from 'ethers'
import { DragonSwapCommandHandler } from './commands/dragonswap/handler'

import { Command } from './commands/interface'
import { BalanceOfCommand } from './commands/dragonswap/balanceOf'
import { CommandHandler } from './commands'
import { SakeInuCommandHandler } from './commands/sakeinu/handler'
import { SakeInuMaxApprove } from './commands/sakeinu/maxApprove'
import { SakeInu } from './contracts/sakeinu'
import { DragonSwapPair } from './contracts/dragonswap/pair'
import { DragonSwapAddLiquidity } from './commands/dragonswap/addLiquidity'
import { DragonSwapRouter } from './contracts/dragonswap/router'

import runCli from './utils/cli-interaction'
import { SakeInuSetERC721Exemption } from './commands/sakeinu/setERC721Exemption'

function init() {
  initWallet()
}

function dragonSwapInit(): Command {
  const dsPairContract = new ethers.Contract(
    config.dsConfig.pair,
    pairAbi,
    wallet,
  )
  const dsPair = new DragonSwapPair(dsPairContract)

  const dsRouterContract = new ethers.Contract(
    config.dsConfig.router,
    routerAbi,
    wallet,
  )
  const dsRouter = new DragonSwapRouter(dsRouterContract)
  // TODO: add more commands
  const dsCommands: Command[] = [
    new DragonSwapAddLiquidity(dsRouter),
    new BalanceOfCommand(dsPair),
  ]
  return new DragonSwapCommandHandler(dsCommands)
}

function sakeInuInit(): Command {
  const siContract = new ethers.Contract(config.sakeInu, siAbi, wallet)
  const si = new SakeInu(siContract)

  const siCommands: Command[] = [
    new SakeInuMaxApprove(si),
    new SakeInuSetERC721Exemption(si)
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
