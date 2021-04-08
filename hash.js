const { workerData, parentPort } = require('worker_threads')
const bcrypt = require('bcrypt')

function sleep(ms) {
  return new Promise((res) => {
    setTimeout(() => {
      console.log(`Finally ${new Date().toISOString()}`)
      res(true)
    }, ms)
  })
}

async function main() {
  const { password, rounds } = workerData

  const salts = await bcrypt.genSalt(rounds)
  const hash = await bcrypt.hash(password, salts)

  console.log(`Start ${new Date().toISOString()}`)
  await sleep(5000)

  parentPort.postMessage({ hash, salts })
}

main()
