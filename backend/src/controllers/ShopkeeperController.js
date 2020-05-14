const connection = require('../database/connection')
const crypto = require('crypto')

module.exports = {

  async index (request, response) {
    const shopkeepers = await connection('shopkeepers').select('*')

    return response.json(shopkeepers)
  },

  async list (request, response) {
    const { uuid } = request.params

    const shopkeeper = await connection('shopkeepers')
      .where('uuid', uuid)
      .select('*')
      .first()

    if (!shopkeeper) {
      return response.json({ type: 'SHOPKEEPER_NOT_FOUND' })
    }
    return response.json(shopkeeper)
  },

  async create (request, response) {
    const {
      ownername,
      fantasyname,
      cpfcnpj,
      email,
      password,
      address,
      addressnumber,
      neighborhood,
      city,
      uf,
      phone,
      cell,
      bank,
      ag,
      cc
    } = request.body

    const uuid = crypto.randomBytes(10).toString('HEX')
    const active = true
    const admin = false

    const apikey = crypto.randomBytes(16).toString('HEX')
    const apiid = crypto.randomBytes(16).toString('HEX')

    await connection('shopkeepers').insert({
      ownername,
      fantasyname,
      cpfcnpj,
      email,
      password,
      address,
      addressnumber,
      neighborhood,
      city,
      uf,
      phone,
      cell,
      bank,
      ag,
      cc,

      uuid,
      apiid,
      apikey,
      admin,
      active
    })

    return response.json({ ok: true })
  },

  async update (request, response) {
    const { uuid } = request.params
    const {
      ownername,
      fantasyname,
      cpfcnpj,
      email,
      password,
      address,
      addressnumber,
      neighborhood,
      city,
      uf,
      phone,
      cell,
      bank,
      ag,
      cc,
      admin,
      active
    } = request.body

    const id = await connection('shopkeepers')
      .where('uuid', uuid)
      .update({
        ownername,
        fantasyname,
        cpfcnpj,
        email,
        password,
        address,
        addressnumber,
        neighborhood,
        city,
        uf,
        phone,
        cell,
        bank,
        ag,
        cc,
        admin,
        active
      })
      .returning('id')

    if (id.length === 0) {
      return response.json({ ok: false })
    }

    return response.json({ ok: true })
  },

  async getShopkeeper (apiid, apikey) {
    const shopkeeper = await connection('shopkeepers')
      .where('apiid', apiid)
      .where('apikey', apikey)
      .select(['id','fantasyname'])
      .first()

    if (!shopkeeper) {
      return { shopkeeper: null }
    }

    return {
      shopkeeper
    }
  }

}
