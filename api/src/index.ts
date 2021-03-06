import http from 'http'
import colors from 'colors'

import Server from './server'
import API_PORT from './config/api_port'

const port = normalizePort(process.env.API_PORT || API_PORT)
Server.set('port', port)

const server = http.createServer(Server)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalizes port value
 * @param {number|string} val input
 * @returns {numnber|string|boolean} output
 */
function normalizePort(val: number|string): number|string|boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val

  if (isNaN(port)) return val
  else if (port >= 0) return port
  else return false
}

/**
 * On server error event
 * @param {NodeJS.ErrnoException} error input
 * @returns {void} void
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port
  switch(error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * On server listening event
 * @returns {void} void
 */
function onListening(): void {
  let addr = server.address()
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr!.port}`
  console.log(colors.green('Server is listening on'), colors.white(bind))
}