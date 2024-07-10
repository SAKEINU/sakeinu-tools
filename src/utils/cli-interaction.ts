import readline from 'readline'
import { Command } from '../commands/interface'

const command = '>>> commands: '

// get input from the user and run the function by it.
// write a code
function getInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(prompt, (input) => {
      rl.close()
      resolve(input)
    })
  })
}

export async function run<T extends Command>(commands?: T) {
  const exitCommands = ['exit', 'quit']
  let shouldExit = false
  while (!shouldExit) {
    const userInput = await getInput(command)
    if (exitCommands.includes(userInput.toLowerCase())) {
      shouldExit = true
    } else {
      await commands.run(userInput.split(' '))
    }
  }
  process.exit(0)
}

export default run
