import { Command } from '../interface'

import { SakeInu } from '../../contracts/sakeinu'

export class SakeInuIsLocked implements Command {
  readonly command: string = 'isLocked'
  readonly description = 'isLocked <token_id>'
  readonly help = '<token_id>'

  constructor(private readonly si: SakeInu) {}

  async run(args: any[]): Promise<boolean> {
    if (args.length !== 1) {
      console.error(this.help)
      return false
    }
    const isLock = await this.si.isLocked(args[0])

    console.log(isLock)
    console.log('--------------------------------')
    return true
  }
}
