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
import { CommandHandler } from './commands'
import run from './utils/cli-interaction'
import { Command } from './commands/interface'
import { BalanceOfCommand } from './commands/dragonswap/balanceOf'

function init() {
  initWallet()
}

async function bootstrap() {
  init()
  const dsContract = new ethers.Contract(config.dsConfig.pair, pairAbi, wallet)
  const dsPair = new DragonSwapPair(dsContract)

  // TODO: add more commands
  const commands: Command[] = [
    new BalanceOfCommand(dsPair)
  ]

  const dsHandler = new DragonSwapCommandHandler(commands)
  const commandHandler = new CommandHandler(dsHandler, undefined)

  await run(commandHandler)
}

bootstrap()
  .then()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
