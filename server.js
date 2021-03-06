require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const Pusher = require('pusher')
const axios = require('axios')

// Initialise Pusher
const pusher = new Pusher({
  appId: `${process.env.PUSHER_APP_ID}`,
  key: `${process.env.PUSHER_APP_KEY}`,
  secret: `${process.env.PUSHER_APP_SECRET}`,
  cluster: `${process.env.PUSHER_APP_CLUSTER}`,
  userTLS: true,
})

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
})

// Routes
app.get('/', (req, res) => res.send('Welcome'))

// Simulated Cron
setInterval(() => {
  let url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD'

  axios.get(url).then(res => {
    pusher.trigger('price-updates', 'coin-updates', { coin: res.data })
  })
}, 5000)

// Start app
app.listen(process.env.PORT, () => console.log('App running on port 8000!'))

