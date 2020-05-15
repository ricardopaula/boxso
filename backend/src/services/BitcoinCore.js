const axios = require('axios')
const bitcore = require('bitcore-lib');
const privateKey = new bitcore.PrivateKey(process.env.BTC_PRIVATE_KEY);
const Message = require('bitcoinjs-message');

module.exports = {
  async signMessage (messageText) {
    const rawSignature = await Message.sign(messageText, privateKey.toBuffer(), true);
    return rawSignature.toString('base64');
  },

  async checkTransaction(address, value){
    const btcValue = (value * 100000000).toFixed();
    const url1 = `https://chain.api.btc.com/v3/address/${address}`
    const url2 = `https://chainflyer.bitflyer.com/v1/address/${address}`

    let respData = null

    promise1 = axios.get(url1, {timeout: 5000})
    promise2 = axios.get(url2, {timeout: 5000})

    await Promise.all([promise1, promise2]).then((values) => {
      [resp1, resp2] = values
    });

    if (!resp1.data.data && !resp2.data) {
      return {
        error: false,
        type: 'BLOCKCHAIN_ERROR',
        status: false,
        btctx: ''
      }
    }

    let respValue1 = null
    let balance1 = null

    if(resp1.data.data){
      respValue1 = resp1.data.data.unconfirmed_received
      balance1 = resp1.data.data.balance
    }

    let respValue2 = null
    let balance2 = null

    if(resp2.data){
      respValue2 = resp2.data.unconfirmed_balance
      balance2 = resp2.data.confirmed_balance
    }

    if ((respValue1 >= btcValue ) ||
        (respValue2 >= btcValue )) {
      respData = {
        error: false,
        type: 'TRANSACTION_RECEIVED',
        status: true,
        btctx: ''
      }
    }else{
      respData = {
        error: false,
        type: 'TRANSACTION_NOT_RECEIVED',
        status: false,
        btctx: ''
      }
    }

    return respData;
  }
}
