import { CommandHandler } from '..'
import keystore from '../../common/wallet/keystore'
import { Command } from '../interface'

export class WalletCommandHandler extends CommandHandler implements Command {
  constructor(commands: Command[] = []) {
    super(
      'wallet',
      'commands for wallet',
      '<help|commands> for subcommand(s)',
      commands,
    )
    keystore.load()
  }
}
