import { bootstrap } from './bootstrap'
import { run } from './utils/cli-interaction'

async function main() {
  const handler = await bootstrap()
  console.log(handler.description)
  await run(handler)
}

main()
  .then()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
