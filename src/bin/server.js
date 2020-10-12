import app from '../app.js'
import debug from 'debug'
import http from 'http'
import database from './database'

debug('tshirtFactory:server')


  const port = normalizePort(process.env.PORT || '3000')
  const server = http.createServer(app)
  server.listen(port, () => {
    if(process.env.NODE_ENV !== 'test') {
      console.log('Api init - http://localhost:3000')
      database.once('open', () => console.log('Database connected'))
    }
  })
  server.on('listening', onListening)
  server.on('error', onError)

  /**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  const port = parseInt(val, 10)

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
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break;
    default:
      throw error
  }
}

function onListening() { {
    const addr = server.address()
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    debug('Listening on ' + bind)
  }
}

export default server
