'user strict';

const Hapi = require('@hapi/hapi');
const inert = require('inert')
const path = require('path')
const handlebars = require('./lib/helpers')
const vision = require('vision')
const good = require('good')
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
    await server.register({
      plugin: good,
      options: {
        reporters: {
          console: [
            {
              module: 'good-console'
            },
            'stdout'
          ]
        }
      }
    })

    await server.register({
      plugin: require('./lib/api'),
      options: {
        prefix: 'api'
      }
    })

    server.method('setAnswerRight', methods.setAnswerRight)
    server.method('getLast', methods.getLast, {
      cache: {
        expiresIn: 1000 * 60,
        generateTimeout: 2000 // Si el metodo falla despues de este tiempo se ejecuta fuera del cache
      }
    })

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

  server.log('info', `Servidor lanzado en ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
  server.log('UnhandledRejection', error.message, error)
})

process.on('uncaughtException', error => {
  server.log('UncaughtException', error.message, error)
})

init()