const bitcore = require('bitcore-lib');
const privateKey = new bitcore.PrivateKey(process.env.BTC_PRIVATE_KEY);
const Message = require('bitcoinjs-message');

module.exports = {
  async signMessage (messageText) {
    const rawSignature = await Message.sign(messageText, privateKey.toBuffer(), true);
    return rawSignature.toString('base64');
  }
}
