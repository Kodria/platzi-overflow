'use strict'

const Joi = require('@hapi/joi')

const site = require('./controllers/site')
const user = require('./controllers/user')
const login = require('./controllers/login')

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: site.home
  },
  {
    method: 'GET',
    path: '/register',
    handler: site.register
  },
  {
    method: 'POST',
    path: '/create-user',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required().min(3),
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        })
      }
    },
    handler: user.createUser
  },
  {
    method: 'GET',
    path: '/login',
    handler: login.login
  },
  {
    method: 'GET',
    path: '/logout',
    handler: user.logout
  },
  {
    method: 'POST',
    path: '/validate-user',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        })
      }
    },
    handler: user.validateUser
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        index: ['index.html']
      }
    }
  }
];

module.exports = routes