import app from '../app.js'
import debug from 'debug'
import http from 'http'
import mongoose from 'mongoose'

const log = debug('http:server')
const port = normalizePort(process.env.PORT || '3000')

const server = http.createServer(app)

mongoose.connect('mongodb://admin:password@localhost:27017/tshirtFactoryDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(
  () => {
    debug('Database connected')
    server.listen(port)
    server.on('listening', onListening)
    server.on('error', onError)
  },
  (err) => {
    debug('Database error:' + err)
  }

)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
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
  log('Listening on ' + bind)
}