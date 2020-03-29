const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {

  async index(request, response) {
    const shopkeepers = await connection('shopkeepers').select('*');

    return response.json(shopkeepers);
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
    const active = 'true';
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
  }
};
