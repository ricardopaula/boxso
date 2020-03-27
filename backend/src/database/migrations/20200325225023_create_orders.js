
exports.up = function(knex) {
  return knex.schema.createTable('orders', function (table){
    table.increments();

    table.decimal('brlvalue').notNullable();
    table.decimal('btcvalue');
    table.string('btcaddress');
    table.string('btctx');
    table.string('status').notNullable();

    table.integer('shopkeeper_id').notNullable();
    table.foreign('shopkeeper_id').references('id').inTable('shopkeepers');

  });

};

exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};
