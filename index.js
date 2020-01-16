'user strict';

const Hapi = require('@hapi/hapi');
const inert = require('inert')
const path = require('path')
const handlebars = require('./lib/helpers')
const vision = require('vision')
const site = require('./controllers/site')

const methods = require('./lib/methods')
const routes = require('./routes')

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }
})

async function init () {
  try {
    await server.register(inert)
    await server.register(vision)

    server.method('setAnswerRight', methods.setAnswerRight)

    server.state('user', {
      ttl: 1000 * 60 * 60,
      isSecure: process.env.NODE_ENV == 'prod',
      encoding: 'base64json'
    })

    server.views({
      engines: {
        hbs: handlebars
      },
      relativeTo: __dirname,
      path: 'views',
      layout: true,
      layoutPath: 'views'
    })

    server.ext('onPreResponse', site.fileNotFound)
    
    server.route(routes)

    await server.start();
  } catch (error) {
    console.log(error)
    process.exit(1)
  }

  console.log(`Servidor lanzado en ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error.message, error)
})

process.on('uncaughtException', error => {
  console.error('uncaughtException', error.message, error)
})

init()