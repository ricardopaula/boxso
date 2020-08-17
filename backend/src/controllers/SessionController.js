const connection = require('../database/connection')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {

  async index (request, response) {
    return response.json({status: 'Ok'})
  },

  async login (request, response) {
    const { email, password } = request.body

    const shopkeeper = await connection('shopkeepers')
      .where('email', email)
      .select(['uuid', 'fantasyname', 'admin', 'password'])
      .first()

    if (!shopkeeper) {
      return response.json({ type: 'USER_NOT_FOUND' })
    }

    if (! await bcrypt.compare(password, shopkeeper.password)) {
      return response.json({ type: 'INVALID_CREDENTIALS' })
    }

    const token = jwt.sign({ uuid: shopkeeper.uuid }, process.env.BOXSO_SECRET, {
      expiresIn: 86400,
    })


    return response.json({
      type: 'LOGIN_SUCESSFULL',
      uuid: shopkeeper.uuid,
      fantasyname: shopkeeper.fantasyname,
      admin: shopkeeper.admin,
      token
    })
  },

  async checkCredentials (request, response) {
    const apiid = request.headers.apiid
    const apikey = request.headers.apikey


    // console.log('Check Credentials');
    // console.log(apiid);
    // console.log(apikey);

    const shopkeeper = await connection('shopkeepers')
      .where('apiid', apiid)
      .where('apikey', apikey)
      .select(['uuid','fantasyname', 'cpfcnpj'])
      .first()

    if (!shopkeeper) {
      return response.json({
        type: 'INVALID_CREDENTIALS',
        fantasyname: null,
        cpfcnpj: null
      })
    }
    return response.json({
      type: 'CREDENTIALS_OK',
      fantasyname: shopkeeper.fantasyname,
      cpfcnpj: shopkeeper.cpfcnpj
    })
  },

}
