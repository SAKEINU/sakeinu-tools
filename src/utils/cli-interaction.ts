import { Command } from '../commands/interface'
import input from '@inquirer/input'

const command = '>>> commands: '
export async function run<T extends Command>(commands?: T) {
  const exitCommands = ['exit', 'quit']
  let shouldExit = false
  while (!shouldExit) {
    const userInput = await input({ message: command })
    if (exitCommands.includes(userInput.toLowerCase())) {
      shouldExit = true
    } else {
      try {
        await commands.run(userInput.split(' '))
      } catch (err) {
        console.error(err)
      }
    }
  }
  process.exit(0)
}
