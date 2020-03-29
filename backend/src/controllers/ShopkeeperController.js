const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {

  async index(request, response) {
    const shopkeepers = await connection('shopkeepers').select('*');

    return response.json(shopkeepers);
  },

  async list(request, response) {
    const { uuid } = request.params;

    const shopkeeper = await connection('shopkeepers')
      .where('uuid', uuid)
      .select('*')
      .first();

    if (!shopkeeper) {
      return response.json({type: 'SHOPKEEPER_NOT_FOUND'});
    }
    return response.json(shopkeeper);
  },

  async create(request, response) {
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
    } = request.body;

    const uuid = crypto.randomBytes(10).toString('HEX');
    const active = true;
    const apikey = crypto.randomBytes(16).toString('HEX');
    const apiid = crypto.randomBytes(16).toString('HEX');

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
      active
    });

    return response.json({ ok: true });
  },

  async update(request, response) {
    const { uuid } = request.params;
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
      active,
    } = request.body;

    id = await connection('shopkeepers')
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
        active
      })
      .returning('id')

      console.log(id)
    if (id.length == 0) {
      return response.json({ ok: false });
    }

    return response.json({ ok: true });
  },

  async check_credentials(request, response) {
    const apiid = request.headers.apiid;
    const apikey = request.headers.apikey;

    const shopkeepers = await connection('shopkeepers')
      .where('apiid', apiid)
      .where('apikey', apikey)
      .select(['uuid'])
      .first();

    if(!shopkeepers){
      return response.json({type: 'INVALID_CREDENTIALS'});

    }
    return response.json({type: 'CREDENTIALS_OK'});
  },

};
