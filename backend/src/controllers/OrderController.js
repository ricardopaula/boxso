const connection = require('../database/connection')
const crypto = require('crypto')

const exchange = require('../services/Exchange')

module.exports = {
  async index (request, response) {
    const { page = 1 } = request.query

    const [total] = await connection('orders').count()

    const orders = await connection('orders')
      .join('shopkeepers', 'shopkeepers.id', '=', 'orders.shopkeeper_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'orders.*',
        'shopkeepers.fantasyname'
      ])

    response.header('X-Total-Count', total.count)
    return response.json(orders)
  },

  async list (request, response) {
    const { uuid } = request.params

    const orders = await connection('orders')
      .where('uuid', uuid)
      .select(['*'])
      .first()

    return response.json(orders)
  },

  async list_shopkeeper (request, response) {
    const { uuid } = request.params

    const { page = 1 } = request.query
    const [total] = await connection('orders')
      .join('shopkeepers', 'shopkeepers.id', '=', 'orders.shopkeeper_id')
      .where('shopkeepers.uuid', uuid)
      .count()

    const orders = await connection('orders')
      .join('shopkeepers', 'shopkeepers.id', '=', 'orders.shopkeeper_id')
      .where('shopkeepers.uuid', uuid)
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'orders.*'
      ])

    response.header('X-Total-Count', total.count)
    return response.json(orders)
  },

  async create (request, response) {
    const { brlvalue } = request.body

    const status = 'pending'
    const uuid = crypto.randomBytes(10).toString('HEX')

    const apiid = request.headers.apiid
    const apikey = request.headers.apikey
    const shopkeeper_id = await getShopkeeper(apiid, apikey)

    if (!shopkeeper_id) {
      return response.json({
        error: true,
        type: 'INVALID_CREDENTIALS' })
    }

    const {error, type, btcaddress, btcvalue, btccount, nonce } = await createOrderInExchange(brlvalue)

    if (error) {
      return response.json({
        error,
        type
      })
    }

    btctx = nonce

    await connection('orders').insert({
      brlvalue,
      status,
      uuid,
      shopkeeper_id,

      btcaddress,
      btcvalue,
      btccount,
      btctx
    })

    return response.json({
      error: false,
      type: 'ORDER_CREATED',
      uuid: uuid,
      qrcode: `bitcoin:${btcaddress}?amount=${btccount}`,
      btcvalue: btcvalue
    })
  },

  async checkStatus (request, response) {
    const { uuid } = request.params
    const apiid = request.headers.apiid
    const apikey = request.headers.apikey

    const shopkeeper = await connection('shopkeepers')
      .where('apiid', apiid)
      .where('apikey', apikey)
      .select('id')
      .first()

    if (!shopkeeper) {
      return response.json({ type: 'INVALID_CREDENTIALS' })
    }

    const shopkeeper_id = shopkeeper.id

    const order = await connection('orders')
      .where('uuid', uuid)
      .where('shopkeeper_id', shopkeeper_id)
      .select('btctx')
      .first()

    if (!order) {
      return response.json({ type: 'ORDER_NOT_FOUND' })
    }

    let transactionStatus = ''
    const { error, status } = await exchange.checkDeposit(order.btctx)

    if (error) {
      return response.json({
        error: true,
        type: 'ERROR_VERIFY_STATUS',
        status: false})
    }

    if(status){
      transactionStatus = 'confirmed'
    }else{
      transactionStatus = 'pending'
    }

    await module.exports.updateStatus(order.btctx, transactionStatus)

    return response.json({
      error: false,
      type: 'VERIFY_STATUS_OK',
      status: status
    })
  },

  // UTILITARIOS
  async updateStatus (btctx, status) {

    console.log(btctx)
    await connection('orders')
      .update('status', status)
      .where('btctx', btctx)

    return { ok: 'ok' }
  }

}

// Criar order na exchange e retorna o endereço, quantidade de BTC e cotação.
async function createOrderInExchange (brlvalue) {
  // const btcaddress = '1btc' + crypto.randomBytes(10).toString('HEX')
  const btcvalue = 31549.98
  const btccount = (brlvalue / btcvalue).toFixed(8);

  const { error, type, btcaddress, nonce } = await exchange.makeDeposit(btccount)

  return {
    error: error,
    type: type,
    nonce, nonce,
    btcaddress: btcaddress,
    btcvalue: btcvalue,
    btccount: btccount
  }
}

async function getShopkeeper (apiid, apikey) {
  const shopkeeper = await connection('shopkeepers')
    .where('apiid', apiid)
    .where('apikey', apikey)
    .select('id')
    .first()

  if (!shopkeeper) {
    return null
  }

  return shopkeeper.id
}
