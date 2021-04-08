const { Worker } = require('worker_threads')
const Pool = require('worker-threads-pool')
const CPUs = require('os').cpus().length

const pool = new Pool({ max: CPUs })

function startNewWorker(filePath, data, callback) {
  pool.acquire(filePath, { workerData: data }, (err, worker) => {
    if (err) throw err

    worker.on('message', (value) => callback(null, value))
    worker.on('error', (error) => callback(error))
    worker.on('exit', (code) => {
      if (code !== 0) callback(`Worker stopped with exit code ${code}`)
    })

    console.log({ threadId: worker.threadId })
  })
}

function startNewWorkerPromised(filePath, data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(filePath, { workerData: data })
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
    })

    console.log({ threadId: worker.threadId })
  })
}

module.exports = {
  startNewWorker,
  startNewWorkerPromised,
}
