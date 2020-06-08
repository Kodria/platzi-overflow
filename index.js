'user strict'

const Hapi = require('@hapi/hapi')
const crumb = require('crumb')
const happiDevErrors = require('hapi-dev-errors')
const blankie = require('blankie')
const scooter = require('scooter')
const inert = require('inert')
const path = require('path')
const handlebars = require('./lib/helpers')
const vision = require('vision')
const good = require('good')
const site = require('./controllers/site')

const methods = require('./lib/methods')
const routes = require('./routes')

const server = Hapi.server({
  port: process.env.PORT || 3001,
  host: '0.0.0.0',
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
      plugin: crumb,
      options: {
        cookieOptions: {
          isSecure: process.env.NODE_ENV === 'prod'
        }
      }
    })

    await server.register({
      plugin: require('./lib/api'),
      options: {
        prefix: 'api'
      }
    })

    await server.register([scooter, {
      plugin: blankie,
      options: {
        defaultSrc: "'self' 'unsafe-inline'",
        styleSrc: "'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com",
        fontSrc: "'self' 'unsafe-inline' data:",
        scriptSrc: "'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com/ https://code.jquery.com/ https://cdnjs.cloudflare.com/",
        generateNonces: false
      }
    }])

    await server.register({
      plugin: happiDevErrors,
      options: {
        showErrors: process.env.NODE_ENV !== 'prod'
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
      isSecure: process.env.NODE_ENV === 'prod',
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

    await server.start()
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
