'use strict'

class Questions {
  
  constructor (db) {
    this.db = db
    this.ref = this.db.ref('/')
    this.collection = this.ref.child('questions')
  }

  async create(data, user) {
    const question = {
      ...data,
      owner: user
    }

    const newQuestion = this.collection.push(question)

    return newQuestion.key
  }

  async getLast(amount) {
    const query = await this.collection.limitToLast(amount).once('value')
    const data = query.val()
    return data
  }

  // async validateUser(data) {
  //   const query = await this.collection.orderByChild('email').equalTo(data.email).once('value')    

  //   const userFound = query.val()
  //   if (userFound) {
  //     const userId = Object.keys(userFound)[0]
  //     const passRight = await bcrypt.compare(data.password, userFound[userId].password)
  //     const result = (passRight) ? userFound[userId] : false

  //     return result
  //   }

  //   return false
  // }

  // static async encript(password) {
  //   const saltRounds = 10
  //   const hashedPassword = await bcrypt.hash(password,saltRounds)

  //   return hashedPassword;
  // }
}

module.exports = Questions