'use strict'

const questions = require('../models').questions

async function home(req, h) {

  let data
  try {
    data = await questions.getLast(10)
  } catch(error) {
    console.error(error)
  }
  return h.view('index',{
    title: 'Home',
    user: req.state.user,
    questions: data
  })
}

function register (req, h) {
  if (req.state.user) {
    return h.redirect('/')
  }

  return h.view('register',{
    title: 'Registro',
    user: req.state.user
  })
}

function ask (req, h) {
  if (!req.state.user) {
    return h.redirect('/login')
  }

  return h.view('ask',{
    title: 'Crear pregunta',
    user: req.state.user
  })
}

function notFound(req, h) {
  return h.view('404', null, {
    layout: 'error-layout'
  }).code(404)
}

function fileNotFound(req, h) {
  const response = req.response

  if (response.isBoom && response.output.statusCode === 404) {
    return h.view('404', null, {
      layout: 'error-layout'
    }).code(404)
  }

  return h.continue
}

module.exports = {
  home,
  register,
  notFound,
  fileNotFound,
  ask
}