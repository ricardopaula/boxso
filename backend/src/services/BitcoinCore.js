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
    const url = `https://chain.api.btc.com/v3/address/${address}`
    let respData = null

    const resp = await axios.get(url)
      .catch(error => {
        return {
          error: true,
          type: 'BLOCKCHAIN_ERROR',
          status: false,
          btctx: ''
        }
      });

      if (!resp.data.data) {
        return {
          error: false,
          type: 'BLOCKCHAIN_ERROR',
          status: false,
          btctx: ''
        }
      }

    const respValue = resp.data.data.unconfirmed_received
    const balance = resp.data.data.balance
    const lastTx = resp.data.data.last_tx

    if (respValue >= btcValue || balance >= respValue) {
      respData = {
        error: false,
        type: 'TRANSACTION_RECEIVED',
        status: true,
        btctx: lastTx
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
