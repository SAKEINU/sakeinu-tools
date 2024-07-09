import { Command } from './interface'

export class CommandHandler implements Command {
  command: string = 'ds'
  description: string = 'commands for SakeInu or DragonSwap'
  help: string = 'supported command: ds'

  handler: Map<string, Command> = new Map()

  constructor(ds: Command, si: Command) {
    this.handler.set('ds', ds)
  }

  run(args: any[]): Promise<boolean> {
    if (args.length === 0) {
      console.error(this.help)
      return Promise.resolve(false)
    }

    switch (args[0]) {
      case 'ds':
        return this.handler.get('ds').run(args.slice(1))
      case 'si':
        console.error('SakeInu commands not implemented yet')
        return Promise.resolve(false)
      default:
        console.error(`Unknown command ${args[0]}`)
        console.log(this.help)
        return Promise.resolve(false)
    }
  }
}
