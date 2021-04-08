const express = require('express')
const { startNewWorker } = require('./worker')

const app = express()

app.get('/', (req, res) => {
  res.status(200).send({ apiStatus: 'ok' })
})

app.get('/worker', async (req, res) => {
  const { password } = req.query

  if (!password) return res.status(400).send({ message: 'Please, enter a valid password' })

  const filePath = `${__dirname}/hash.js`
  const data = { password, salts: 1000 }
  const callback = (error, value) => {
    if (error) {
      console.log(`Error ${error}`)
      return
    }

    console.log('Success', { value })
  }

  const list = [1, 2, 3, 4]
  list.map(() => startNewWorker(filePath, data, callback))

  res.status(200).send({ message: 'Starting new Node.js Worker...' })
})

app.listen(3333, () => console.log('App is listening on http://localhost:3333'))
