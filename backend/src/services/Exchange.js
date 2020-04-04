const axios = require('axios')
const crypto = require('crypto')

const blockexplorer = null

module.exports = {

  async check (request, response) {

    resp = await makeDeposit()

    return response.json(resp.data)
  }
}

async function makeDeposit() {
  const url = 'https://sqs.us-east-1.amazonaws.com/211690707610/walltime-production-api?Action=SendMessage&Version=2011-10-01'

  // const nonce = 'af5571cc-bca0-4384-a8a4-9ad118272bef'
  const nonce = crypto.randomBytes(16).toString('HEX')
  const user = '3905d6d0-720b-ae00-2404-123048082400'
  const bitcoinAddress = '1Lj6CEXAMPLEINVALIDADDRESSXGgerDyj'
  const bitcoinSignature = 'H1jCO0rRWBcQHVRgO+oUfmetWj9Fwb9ZK/KUB/sasIakTcGuH8tyyZ3Qa0GWeItULf5y57/pIdZF5pY0N0RqAyE='

  const opt = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }

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
          "declared_amount":"5/1000"
        }"
      }"
    }`

  let resp = await axios.post(url, data, opt)
  console.log('OK 1')
  console.log(resp.data)


  return resp = await checkDeposit(nonce)
}

async function checkDeposit(nonce) {
  const url = 'https://s3.amazonaws.com/response-production-walltime-info/production/index/'

  return await axios.get(`${url}${nonce}`)
}
