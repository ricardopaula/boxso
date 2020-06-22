const connection = require('../database/connection')

before(async () => {
  await connection.raw('DELETE FROM orders;');
  await connection.raw('DELETE FROM shopkeepers;');

  await connection.raw('ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
  await connection.raw('ALTER SEQUENCE shopkeepers_id_seq RESTART WITH 1;');
})
