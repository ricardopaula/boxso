const knex = require('knex')
const configuration = require('../../knexfile')
var connection
const environment = process.env.NODE_ENV || 'development';


if (environment == 'test') {
  connection = knex(configuration.test)
}else{
  connection = knex(configuration.development)
}

module.exports = connection
