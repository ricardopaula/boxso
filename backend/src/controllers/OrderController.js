const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;

    const [count] = await connection('orders').count();

    const orders = await connection('orders')
      .join('shopkeepers', 'shopkeepers.id', '=', 'orders.shopkeeper_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'orders.*',
        'shopkeepers.fantasyname'
      ]);

    response.header('X-Total-Count', count['count(*)']);
    return response.json(orders);
  },

  async create(request, response) {
    const {brlvalue} = request.body;
    const status = 'pending';

    const apy_key = request.headers.authorization;

    const shopkeeper = await connection('shopkeepers')
      .where('apikey', apy_key)
      .select('id')
      .first();

    if (!shopkeeper){
      return response.json({type: 'INVALID_APIKEY'});
    }

    const shopkeeper_id = shopkeeper.id;

    resp = await connection('orders').insert({
      brlvalue,
      status,
      shopkeeper_id
    });

    return response.json({ok: 'true'});
  }
}
