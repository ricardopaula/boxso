const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;

    const [total] = await connection('orders').count();

    const orders = await connection('orders')
      .join('shopkeepers', 'shopkeepers.id', '=', 'orders.shopkeeper_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'orders.*',
        'shopkeepers.fantasyname'
      ]);

    response.header('X-Total-Count', total.count);
    return response.json(orders);
  },

  async list(request, response) {
    const { uuid } = request.params;

    const orders = await connection('orders')
      .where('uuid', uuid)
      .select(['*'])
      .first();

    return response.json(orders);
  },

  async list_shopkeeper(request, response) {
    const { uuid } = request.params;

    const { page = 1 } = request.query;
    const [total] = await connection('orders')
      .join('shopkeepers', 'shopkeepers.id', '=', 'orders.shopkeeper_id')
      .where('shopkeepers.uuid', uuid)
      .count();

    const orders = await connection('orders')
      .join('shopkeepers', 'shopkeepers.id', '=', 'orders.shopkeeper_id')
      .where('shopkeepers.uuid', uuid)
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'orders.*'
      ]);

    response.header('X-Total-Count', total.count);
    return response.json(orders);
  },

  async create(request, response) {
    const {brlvalue} = request.body;

    const status = 'pending';
    const uuid = crypto.randomBytes(10).toString('HEX');

    const apiid = request.headers.apiid;
    const apikey = request.headers.apikey;
    const shopkeeper_id = await getShopkeeper(apiid, apikey);

    if (!shopkeeper_id){
      return response.json({type: 'INVALID_CREDENTIALS'})
    }

    const { btcaddress, btcvalue, btccount } = createOrderInExchange();

    resp = await connection('orders').insert({
      brlvalue,
      status,
      uuid,
      shopkeeper_id,

      btcaddress,
      btcvalue,
      btccount
    });

    return response.json({
      uuid: uuid,
      qrcode: `bitcoin:${btcaddress}?amount=${btccount}`,
      btcvalue: btcvalue,
    });
  },

  async checkStatus(request, response) {
    const { uuid } = request.params;
    const apiid = request.headers.apiid;
    const apikey = request.headers.apikey;

    const shopkeeper = await connection('shopkeepers')
      .where('apiid', apiid)
      .where('apikey', apikey)
      .select('id')
      .first();

    if (!shopkeeper){
      return response.json({type: 'INVALID_CREDENTIALS'});
    }

    const shopkeeper_id = shopkeeper.id;

    status = await connection('orders')
      .where('uuid', uuid)
      .where('shopkeeper_id', shopkeeper_id)
      .select('status')
      .first();

    if (!status) {
      return response.json({type: 'ORDER_NOT_FOUND'});
    }

    return response.json(status);
  },

  // UTILITARIOS
  async updateStatus(request, response) {
    const { uuid } = request.body;
    const btctx = crypto.randomBytes(10).toString('HEX');

    await connection('orders')
      .update('status', 'confirmed')
      .update('btctx', btctx)
      .where('uuid', uuid)

    return response.json({ok: 'ok'});
  }

}

// Criar order na exchange e retorna o endereço, quantidade de BTC e cotação.
function createOrderInExchange() {
  btcaddress = '1btc' + crypto.randomBytes(10).toString('HEX');
  btcvalue = 31549.98;
  btccount = 0.002514;


  return {
    btcaddress: btcaddress,
    btcvalue: btcvalue,
    btccount: btccount
  }
}

async function getShopkeeper(apiid, apikey){
  shopkeeper = await connection('shopkeepers')
    .where('apiid', apiid)
    .where('apikey', apikey)
    .select('id')
    .first();

  if (!shopkeeper){
    return null;
  }

  return shopkeeper.id;
}
