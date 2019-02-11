// NPM Packages
const path = require('path')
const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')

// Networking
const PORT = process.env.PORT || 5000

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const middleware = [
  express.static(path.join(__dirname, 'public')),
  express.static(path.join(__dirname, 'utilities')),
  bodyParser.urlencoded({ extended: true })
]

app.use(middleware)

app.use('/', routes)

app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))