import app from '../app.js'
import debug from 'debug'
import http from 'http'
import mongoose from 'mongoose'

debug('tshirtFactory:server')

const port = normalizePort(process.env.PORT || '3000')

const server = http.createServer(app)
/* configure database */
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const hostname = process.env.DB_HOSTNAME
const database = process.env.DB_DATABASE

/* connection database */
mongoose.connect(`mongodb://${username}:${password}@${hostname}:27017/${database}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(
  () => {
    // eslint-disable-next-line no-console
    console.log('Database connected')
    server.listen(port, () => {
      console.log(`Api initialization - http://localhost:${port}`)
    })
    server.on('listening', onListening)
    server.on('error', onError)
  },
  (err) => {
    // eslint-disable-next-line no-console
    console.log('We have been a error: ' + err)
  }

)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    console.log('pipe')
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      // eslint-disable-next-line
      break;

    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(bind + ' is already in use')
      process.exit(1)
      // eslint-disable-next-line
      break;
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
