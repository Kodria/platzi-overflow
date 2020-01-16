'use strict'

const questions = require('../models').questions

async function createQuestion(req, h) {
  let result;
  try {
    result = await questions.create(req.payload, req.state.user)
  } catch (error) {
    console.error(error)

    return h.view('ask',{
      title: 'Crear pregunta',
      error: 'Error creando una pregunta'
    }).code(500).takeover()
  }
  
  return h.response('Pregunta creada')
}

module.exports = {
  createQuestion
}