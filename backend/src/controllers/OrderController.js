const connection = require('../database/connection')
const crypto = require('crypto')

const bitcore = require('bitcore-lib');
const bitcoincore = require('../services/BitcoinCore')

const exchange = require('../services/Exchange')
const helper = require('../services/Helper')
const shopk = require('./ShopkeeperController')

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
      .orderBy('id', 'asc')

    response.header('X-Total-Count', total.count)
    return response.json(orders)
  },

  async list (request, response) {
    const { uuid } = request.params

    const orders = await connection('orders')
      .where('uuid', uuid)
      .select(['*'])
      .first()
      .orderBy('id', 'asc')

    return response.json(orders)
  },

  async listShopkeeper (request, response) {
    const { uuid } = request.params

    const { page = 1 } = request.query
    const [total] = await connection('orders')
      .join('shopkeepers', 'shopkeepers.id', '=', 'orders.shopkeeper_id')
      .where('shopkeepers.uuid', uuid)
      .count()

    const orders = await connection('orders')
      .join('shopkeepers', 'shopkeepers.id', '=', 'orders.shopkeeper_id')
      .where('shopkeepers.uuid', uuid)
      .limit(20)
      .offset((page - 1) * 20)
      .select([
        'orders.*'
      ])
      .orderBy('id', 'asc')

    response.header('X-Total-Count', total.count)
    return response.json(orders)
  },

  async latestConfirmedList (request, response) {
    const apiid = request.headers.apiid
    const apikey = request.headers.apikey
    const { shopkeeper } = await shopk.getShopkeeper(apiid, apikey)

    if (!shopkeeper) {
      return response.json({
        error: true,
        type: 'INVALID_CREDENTIALS' })
    }

    const orders = await connection('orders')
      .where('shopkeeper_id', shopkeeper.id)
      .where('status', 'confirmed')
      .limit(5)
      .select([
        'orders.*'
      ])
      .orderBy('id', 'desc')

    return response.json(orders)
  },

  async create (request, response) {

    // return response.json({
    //   "error": false,
    //   "type": "ORDER_CREATED",
    //   "uuid": "fe8deb91900d43bf98691aa1ef17b8ed",
    //   "qrcode": "bitcoin:3BUD9nreKM63pvqoRu7StfVFsogkwifsHF?amount=0.00281926&message=mercado-tio-joao",
    //   "btcvalue": "52496.0"
    // });



    const { brlvalue } = request.body

    const status = 'pending'
    // const uuid = crypto.randomBytes(10).toString('HEX')

    const apiid = request.headers.apiid
    const apikey = request.headers.apikey
    const { shopkeeper } = await shopk.getShopkeeper(apiid, apikey)

    if (!shopkeeper) {
      return response.json({
        error: true,
        type: 'INVALID_CREDENTIALS' })
    }

    const shopkeeper_id = shopkeeper.id
    const fantasyname = shopkeeper.fantasyname
    let error = false
    let type = ''
    let btcaddress = ''
    let btcvalue = 0.0
    let btccount = 0.0
    let nonce = ''

    if(shopkeeper.homolog){
      error = false
      type = 'ADDRESS_CREATED'
      btcaddress = '3LBm64668oh1LWAmExm5GuhJxAHAzPX5i5'
      btcvalue = 320450.95
      btccount = 0.00012542
      nonce = crypto.randomBytes(10).toString('HEX')
    }else{
      resp = await createOrderInExchange(brlvalue)

      error = resp.error
      type = resp.type
      btcaddress = resp.btcaddress
      btcvalue = resp.btcvalue
      btccount = resp.btccount
      nonce = resp.nonce
    }

    if (error) {
      return response.json({
        error,
        type
      })
    }

    uuid = nonce

    await connection('orders').insert({
      brlvalue,
      status,
      uuid,
      shopkeeper_id,

      btcaddress,
      btcvalue,
      btccount
    })

    return response.json({
      error: false,
      type: 'ORDER_CREATED',
      uuid: uuid,
      qrcode: `bitcoin:${btcaddress}?amount=${btccount}&message=${helper.replaceSpecialChars(fantasyname)}`,
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
      .select('id', 'homolog')
      .first()

    if (!shopkeeper) {
      return response.json({ type: 'INVALID_CREDENTIALS' })
    }

    const shopkeeper_id = shopkeeper.id

    const order = await connection('orders')
      .where('uuid', uuid)
      .where('shopkeeper_id', shopkeeper_id)
      .select(['btcaddress', 'btccount'])
      .first()

    if (!order) {
      return response.json({ type: 'ORDER_NOT_FOUND' })
    }

    let transactionStatus = ''
    let error = false
    let status = true
    let btctx = ''

    if(shopkeeper.homolog){
      error = false
      status = true
      btctx = crypto.randomBytes(10).toString('HEX')

      ms = helper.randomInteger(5000, 35000)
      await helper.sleep(ms);
    }else{
      const resp = await bitcoincore.checkTransaction(order.btcaddress, order.btccount)
      error = resp.error
      status = resp.status
      btctx = resp.btctx
    }

    if (error) {
      return response.json({
        error: true,
        type: 'ERROR_VERIFY_STATUS',
        status: false})
    }

    if(status){
      transactionStatus = 'confirmed'
      await module.exports.updateStatus(uuid, transactionStatus, btctx)
      recived = true
    }else{
      transactionStatus = 'pending'
      recived = false
    }

    return response.json({
      error: false,
      type: 'VERIFY_STATUS_OK',
      recived: recived
    })
  },

  // UTILITARIOS
  async updateStatus (uuid, status, btctx) {

    await connection('orders')
      .update('status', status)
      .update('btctx', btctx)
      .where('uuid', uuid)

    return { ok: 'ok' }
  },

  async teste (request, response){

    const signature = 'H6DEuDsRbPrVykOt1+/oULBPDwPl7D3+uMEsosFgFemLAClw5gvoJNAuESQp0rt7A7wbtuPNWOQQ1CE5ECGbQfs='

    var address = process.env.BTC_PUBLIC_KEY;

    var verified = new bitcore.Message(`{\"nonce\":\"3e828802a0129001766246ad414cf655\",\"version\":\"v1\",\"command\":\"get-account-info\",\"user\":\"5582646a-ab04-c800-0594-6d2d0b28da40\",\"body\":\"{}\"}`).verify(address, signature);

    return response.json({signature: signature, verified: verified})
  }
}

// Criar order na exchange e retorna o endereço, quantidade de BTC e cotação.
async function createOrderInExchange (brlvalue) {
  // const btcaddress = '1btc' + crypto.randomBytes(10).toString('HEX')

  const resp = await exchange.getBTCValue();

  if (resp.error){
    return {
      error: true,
      type: 'EXCHANGE_BTCVALUE_ERROR'
    }
  }else{
    const btcvalue = resp.btcvalue
    const btccount = (brlvalue / btcvalue).toFixed(8);

    const { error, type, btcaddress, nonce } = await exchange.makeDeposit(btccount)

    return {
      error: error,
      type: type,
      nonce: nonce,
      btcaddress: btcaddress,
      btcvalue: btcvalue,
      btccount: btccount
    }
  }
}
