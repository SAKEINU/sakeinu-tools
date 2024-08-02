#!/usr/bin/env node

import { bootstrap } from './bootstrap'

async function main() {
  const handler = await bootstrap()
  const userInput = process.argv.slice(2)
  handler.run(userInput)
}

main()
  .then()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
