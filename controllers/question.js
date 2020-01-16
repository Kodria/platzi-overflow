'use strict'

const questions = require('../models').questions

async function createQuestion(req, h) {

  if (!req.state.user) return h.redirect('/login')

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

async function answerQuestion(req, h) {

  if (!req.state.user) return h.redirect('/login')

  let result;
  try {
    result = await questions.answer(req.payload, req.state.user)
  } catch (error) {
    console.log(error)
  }

  return h.redirect(`/question/${req.payload.id}`)
}

async function setAnswerRight(req, h) {

  if (!req.state.user) return h.redirect('/login')
  
  let result
  try {
    result = await req.server.methods.setAnswerRight(req.params.questionId, req.params.answerId, req.state.user)
  } catch (error) {
    console.error(error)
  }

  return h.redirect(`/question/${req.params.questionId}`)
}

module.exports = {
  createQuestion,
  answerQuestion,
  setAnswerRight
}