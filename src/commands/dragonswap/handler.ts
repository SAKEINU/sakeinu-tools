import { DragonSwapPair } from '../../contracts/dragonswap/pair'
import { Command } from '../interface'
import { BalanceOfCommand } from './balanceOf'

export class DragonSwapCommandHandler implements Command {
  readonly command: string = 'ds'
  readonly description = 'commands for DragonSwap'
  readonly help = 'ds must be called with subcommand(s)'
  readonly helps: string = ''

  private commands: Map<string, Command> = new Map()

  constructor(commands: Command[] = []) {
    commands.forEach((cmd) => this.setCommand(cmd))

    this.helps =
      this.help +
      '\n' +
      Array.from(this.commands.values())
        .map((cmd) => cmd.help)
        .join('\n')
  }

  async run(args: any[]): Promise<boolean> {
    if (args.length === 0) {
      console.error(this.helps)
      return false
    }

    if (args[0] === 'help') {
      console.log(`${this.helps}`)
      return true
    }

    if (this.commands.get(args[0]) === undefined) {
      console.error(`Unknown command ${args[0]} \n` + `${this.helps}`)
      return false
    }

    return this.commands.get(args[0]).run(args.slice(1))
  }

  private setCommand(cmd: Command) {
    if (this.commands.has(cmd.command)) {
      throw new Error(`Command ${cmd.command} already exists`)
    }
    this.commands.set(cmd.command, cmd)
  }
}
