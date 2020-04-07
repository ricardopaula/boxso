const axios = require('axios')
const crypto = require('crypto')

const blockexplorer = null

module.exports = {

  async check (request, response) {
    resp = await makeDeposit(0.0025)

    return response.json(resp.data)
  },

  async makeDeposit(btcCount) {
    const url = 'https://sqs.us-east-1.amazonaws.com/211690707610/walltime-production-api?Action=SendMessage&Version=2011-10-01'

    const nonce = crypto.randomBytes(16).toString('HEX')
    const user = '3905d6d0-720b-ae00-2404-123048082400'
    const bitcoinAddress = '1Lj6CEXAMPLEINVALIDADDRESSXGgerDyj'
    const bitcoinSignature = 'H1jCO0rRWBcQHVRgO+oUfmetWj9Fwb9ZK/KUB/sasIakTcGuH8tyyZ3Qa0GWeItULf5y57/pIdZF5pY0N0RqAyE='

    const opt = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }

    const btcAmount = `${btcCount * 1000}/1000`

    const data =
      `MessageBody={
        "bitcoin-address": ${bitcoinAddress},
        "bitcoin-signature": ${bitcoinSignature},
        "data":"{
          "nonce": ${nonce},
          "version": "v1",
          "command": "generate-new-deposit-address",
          "user": ${user},
          "body": "{
            "currency": "xbt",
            "declared_amount": ${btcAmount}
          }"
        }"
      }`

    await axios.post(url, data, opt)
      .catch(error => {
        return {
          error: true,
          type: 'EXCHANGE_ERROR_MAKE_DEPOSIT',
          btcaddress: ''
        }
      });

    const { error, type, btcaddress } = await module.exports.checkDeposit(nonce)

    return { error, type, btcaddress, nonce }
  },

  async checkDeposit(nonce) {
    const url = 'https://s3.amazonaws.com/response-production-walltime-info/production/index/'

    let respData = {}

    await axios.get(`${url}${nonce}`)
      .then(response => {
        respData = {
          error: false,
          type: 'ADDRESS_CREATED',
          btcaddress: response.data.address,
          status: response.data.status.success
        }
      })
      .catch(error => {
        respData =  {
          error: true,
          type: 'EXCHANGE_ERROR',
          btcaddress: '',
          status: false
        }
      });

      respData = {
        error: false,
        type: 'ADDRESS_CREATED',
        btcaddress: 'btc123456789abc',
        status: true
      }

    return respData
  }


}
