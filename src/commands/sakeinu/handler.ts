import { CommandHandler } from '..'
import { Command } from '../interface'

export class SakeInuCommandHandler extends CommandHandler implements Command {
  constructor(commands: Command[] = []) {
    super(
      'si',
      'commands for SAKEINU',
      '<help|commands> for subcommand(s)',
      commands,
    )
  }
}
