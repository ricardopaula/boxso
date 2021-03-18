exports.up = function(knex) {
  return knex.schema.table('shopkeepers', function (table) {
    table.boolean('homolog').defaultTo(false);
  })
};

exports.down = function(knex) {
  return knex.schema.table('shopkeepers', function (table) {
    table.dropColumn('homolog');
  })
};
