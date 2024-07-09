export interface Command {
  command: string
  description: string
  help: string
  run(args: any[]): Promise<boolean>
}
