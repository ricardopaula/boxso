const connection = require('../database/connection')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

module.exports = {

  async index (request, response) {

    if(! await module.exports.isAdmin(request.uuid))
      return response.json({error: 'Access denied'})

    const shopkeepers = await connection('shopkeepers').select('*').orderBy('id', 'asc')

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
    if(! await module.exports.isAdmin(request.uuid))
      return response.json({error: 'Access denied'})

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
    const passwordHash = await bcrypt.hash(password, 10)

    const apikey = crypto.randomBytes(16).toString('HEX')
    const apiid = crypto.randomBytes(16).toString('HEX')

    await connection('shopkeepers').insert({
      ownername,
      fantasyname,
      cpfcnpj,
      email,
      password: passwordHash,
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
    if(! await module.exports.isAdmin(request.uuid))
      return response.json({error: 'Access denied'})

    let passwordHash
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


    if (password)
      passwordHash = await bcrypt.hash(password, 10)

    const id = await connection('shopkeepers')
      .where('uuid', uuid)
      .update({
        ownername,
        fantasyname,
        cpfcnpj,
        email,
        password: passwordHash,
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

  async isAdmin(uuid) {
    const shopkeeper = await connection('shopkeepers')
      .where('uuid', uuid)
      .select('admin')
      .first()

    if (!shopkeeper) {
      return false
    }

    return shopkeeper.admin
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
