
exports.up = function (knex) {
  return knex.schema.createTable('shopkeepers', function (table) {
    table.increments().primary()
    table.string('uuid').notNullable()

    table.string('ownername').notNullable()
    table.string('fantasyname').notNullable()
    table.string('cpfcnpj').notNullable()
    table.string('email').notNullable()
    table.string('password').notNullable()
    table.string('address').notNullable()
    table.string('addressnumber').notNullable()
    table.string('neighborhood')
    table.string('city').notNullable()
    table.string('uf', 2).notNullable()
    table.string('phone')
    table.string('cell')
    table.string('bank')
    table.string('ag')
    table.string('cc')

    table.string('apikey')
    table.string('apiid')

    table.boolean('admin').notNullable()
    table.boolean('active').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('shopkeepers')
}
