// load env variables
import { config as loadConfig } from 'dotenv'
loadConfig()

import { config, initEnv } from './common/config/config'
initEnv()

import pairAbi from './contracts/dragonswap/pair.json'
import { wallet, initWallet } from './common/wallet'

import { ethers } from 'ethers'
import { DragonSwapPair } from './contracts/dragonswap'
import { DragonSwapCommandHandler } from './commands/dragonswap/handler'

import runCli from './utils/cli-interaction'
import { Command } from './commands/interface'
import { BalanceOfCommand } from './commands/dragonswap/balanceOf'
import { CommandHandler } from './commands'
import { SakeInuCommandHandler } from './commands/sakeinu/handler'

function init() {
  initWallet()
}

async function bootstrap() {
  init()
  const dsContract = new ethers.Contract(config.dsConfig.pair, pairAbi, wallet)
  const dsPair = new DragonSwapPair(dsContract)

  // TODO: add more commands
  const dsCommands: Command[] = [
    new BalanceOfCommand(dsPair)
  ]
  const dsHandler = new DragonSwapCommandHandler(dsCommands)


  const siCommands: Command[] = []
  const siHandler = new SakeInuCommandHandler(siCommands)
  const commandHandler = new CommandHandler(
    '',
    'cli tools for SAKEINU(si) and DragonSwap(ds)',
    '<command> <subcommand> <args...> ',
    [
      dsHandler,
      // siHandler
    ]
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
