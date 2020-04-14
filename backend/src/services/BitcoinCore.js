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
          type: 'BLOCKCHAIN_ERROR'
        }
      });

    const received = resp.data.data.received
    const respValue = resp.data.data.unconfirmed_received

    console.log(url)
    console.log(respValue)
    console.log(btcValue)

    if (respValue >= btcValue) {
      respData = {
        error: false,
        type: 'TRANSACTION_RECEIVED'
      }
    }else{
      respData = {
        error: false,
        type: 'TRANSACTION_NOT_RECEIVED'
      }
    }

    return respData;
  }
}
