#!/usr/bin/env node

import { bootstrap } from './bootstrap'

async function main() {
  const userInput = process.argv.slice(2)
  const handler = await bootstrap(userInput[0] === 'wallet')
  handler.run(userInput)
}

main()
  .then()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
