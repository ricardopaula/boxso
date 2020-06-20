const connection = require('../database/connection')

module.exports = {

  async index (request, response) {
    return response.json({status: 'Ok'})
  },

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
