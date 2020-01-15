'use strict'

function login (req, h) {
  return h.view('login',{
    title: 'Ingrese',
    user: req.state.user
  })
}

module.exports = {
  login
}