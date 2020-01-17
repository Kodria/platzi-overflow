'use strict'

function login (req, h) {
  if (req.state.user) {
    return h.redirect('/')
  }

  return h.view('login', {
    title: 'Ingrese',
    user: req.state.user
  })
}

module.exports = {
  login
}
