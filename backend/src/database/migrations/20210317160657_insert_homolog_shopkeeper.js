const connection = require('../connection')
const crypto = require('crypto')

exports.up = function(knex) {
  const ownername = 'Boxso'
  const fantasyname = 'Boxso Homolog'
  const cpfcnpj = '00.000.000/0000-00'
  const email = 'homolog@boxso.com.br'
  const password = 'boxso@homolog'
  const address = 'N/A'
  const addressnumber = 'N/A'
  const city = 'São José dos Campos'
  const uf = 'SP'
  const uuid = crypto.randomBytes(10).toString('HEX')
  const apiid = crypto.randomBytes(16).toString('HEX')
  const apikey = crypto.randomBytes(16).toString('HEX')
  const admin = false
  const active = true
  const homolog = true

  return connection('shopkeepers').insert({
    ownername,
    fantasyname,
    cpfcnpj,
    email,
    password,
    address,
    addressnumber,
    city,
    uf,
    uuid,
    apiid,
    apikey,
    admin,
    active,
    homolog
  })
};

exports.down = function(knex) {

};
