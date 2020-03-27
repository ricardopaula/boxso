const connection = require('../database/connection');

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

    const active = 'true';
    const apikey = 'abc123';

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
      apikey,
      active
    });

    return response.json({ ok: true });
  }
};
