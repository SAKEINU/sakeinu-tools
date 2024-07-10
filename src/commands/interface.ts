export interface Command {
  command: string
  description: string
  help: string
  helps?: string
  run(args: any[]): Promise<boolean>
}
