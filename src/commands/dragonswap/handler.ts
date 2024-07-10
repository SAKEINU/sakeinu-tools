import { CommandHandler } from '..'
import { Command } from '../interface'

export class DragonSwapCommandHandler extends CommandHandler implements Command {
  constructor(commands: Command[] = []) {
    super('ds', 'commands for DragonSwap', '<help|commands> for subcommand(s)', commands)
  }
}
