'use strict'

const bcrypt = require('bcrypt')

class Users {
  constructor (db) {
    this.db = db
    this.ref = this.db.ref('/')
    this.collection = this.ref.child('users')
  }

  async create (data) {
    const user = {
      ...data
    }

    user.password = await this.constructor.encript(user.password)

    const newUser = this.collection.push(user)

    return newUser.key
  }

  async validateUser (data) {
    const query = await this.collection.orderByChild('email').equalTo(data.email).once('value')

    const userFound = query.val()
    if (userFound) {
      const userId = Object.keys(userFound)[0]
      const passRight = await bcrypt.compare(data.password, userFound[userId].password)
      const result = (passRight) ? userFound[userId] : false

      return result
    }

    return false
  }

  static async encript (password) {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    return hashedPassword
  }
}

module.exports = Users
