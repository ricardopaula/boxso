const connection = require('../database/connection')

module.exports = {

  async login (request, response) {
    const { email, password } = request.body

    const shopkeeper = await connection('shopkeepers')
      .where('email', email)
      .where('password', password)
      .select(['uuid', 'fantasyname', 'admin'])
      .first()

    if (!shopkeeper) {
      return response.json({ type: 'INVALID_CREDENTIALS' })
    }
    return response.json({
      type: 'LOGIN_SUCESSFULL',
      uuid: shopkeeper.uuid,
      fantasyname: shopkeeper.fantasyname,
      admin: shopkeeper.admin
    })
  }

}
