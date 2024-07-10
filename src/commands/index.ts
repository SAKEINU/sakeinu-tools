import { Command } from './interface'

export class CommandHandler implements Command {
  helps = ''
  handler: Map<string, Command> = new Map()

  constructor(
    readonly command: string,
    readonly description: string,
    readonly help: string,
    commands: Command[]
  ) {
    commands?.forEach((cmd) => {
      this.helps = `${this.helps} ` + (this.command ? `<${this.command}> ` : '') + `<${cmd.command}> <${cmd.help}> \n`
      this.setCommand(cmd)
    })
  }

  async run(args: any[]): Promise<boolean> {
    if (args.length === 0) {
      console.error(this.helps)
      return Promise.resolve(false)
    }

    if (args[0] === 'help' || args[0] === 'commands') {
      console.log(this.helps)
      return true
    }

    if (this.handler.get(args[0]) === undefined) {
      console.error(`Unknown command ${args[0]} \n` + `${this.helps}`)
      return false
    }

    return this.handler.get(args[0]).run(args.slice(1))
  }

  private setCommand(cmd: Command) {
    if (this.handler.has(cmd.command)) {
      throw new Error(`Command ${cmd.command} already exists`)
    }
    this.handler.set(cmd.command, cmd)
  }
}
