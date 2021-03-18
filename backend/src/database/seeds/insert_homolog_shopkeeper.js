
exports.seed = function(knex) {
  // const connection = require('..connection')
  const crypto = require('crypto')

  return knex('shopkeepers').insert([
    {
      ownername: 'Boxso',
      fantasyname: 'Boxso Homolog 2',
      cpfcnpj: '00.000.000/0000-00',
      email: 'homolog@boxso.com.br',
      password: 'boxso@homolog',
      address: 'N/A',
      addressnumber: 'N/A',
      city: 'São José dos Campos',
      uf: 'SP',
      uuid: crypto.randomBytes(10).toString('HEX'),
      apiid: crypto.randomBytes(16).toString('HEX'),
      apikey: crypto.randomBytes(16).toString('HEX'),
      admin: false,
      active: true,
      homolog: true,
    },
  ]);
};
