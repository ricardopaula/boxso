const axios = require('axios')
const crypto = require('crypto')
const bitcoincore = require('./BitcoinCore')

const publicKey = process.env.BTC_PUBLIC_KEY;
const wtUuid = process.env.WT_UUID;

const queueUrl = 'https://sqs.us-east-1.amazonaws.com/211690707610/walltime-production-api?Action=SendMessage&Version=2011-10-01'

module.exports = {

  async check (request, response) {
    resp = await makeDeposit(0.0025)

    return response.json(resp.data)
  },

  async makeDeposit(btcCount) {
    const nonce = crypto.randomBytes(16).toString('HEX')
    console.log(`Nonce: ${nonce}`)

    const opt = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }

    const btcAmount = buildBTCAmount(btcCount)

    const data = JSON.stringify({
      'nonce': nonce,
      'version': 'v1',
      'command': 'generate-new-deposit-address',
      'user': wtUuid,
      'body': JSON.stringify({
        'currency': 'xbt',
        'declared_amount': btcAmount
      })
    })

    const bitcoinSignature = await bitcoincore.signMessage(data)

    const body = JSON.stringify({
      'bitcoin-address': publicKey,
      'bitcoin-signature': bitcoinSignature,
      'data': data
    })

    const messageBody = `MessageBody=${body}`

    const resp = await axios.post(queueUrl, messageBody, opt)
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
    let i = 0

    do{
      console.log(`Tentativa ${i+1}`)
      await sleep(2000);

      try {
        await axios.get(`${url}${nonce}`)
        .then(response => {
          if(response.data.status.code === 'SUCCESS'){
            respData = {
              error: false,
              type: 'ADDRESS_CREATED',
              btcaddress: response.data.address,
              status: response.data.status.success
            }
          }else{
            respData = {
              error: true,
              type: 'EXCHANGE_ERROR',
              btcaddress: '',
              status: false
            }
          }
        })
        .catch(error => {
          respData =  {
            error: true,
            type: 'EXCHANGE_REQUEST_ERROR',
            btcaddress: '',
            status: false
          }
        });
      } catch (error) {
        respData =  {
          error: true,
          type: 'EXCHANGE_REQUEST_ERROR',
          btcaddress: '',
          status: false
        }
      }

      i++
      console.log(respData)
    } while (respData.error == true && i < 5);

    return respData
  },

  async getBTCValue(){
    const url = 'https://s3.amazonaws.com/data-production-walltime-info/production/dynamic/walltime-info.json?now=1528962473468.679.0000000000873'

    let respData = {}

    await axios.get(url)
      .then(response => {
        respData = {
          error: false,
          type: 'EXCHANGE_BTC_VALUE',
          btcvalue: response.data.BRL_XBT.last_inexact
        }
      })
      .catch(error => {
        respData =  {
          error: true,
          type: 'EXCHANGE_ERROR',
          btcvalue: ''
        }
      });

    return respData
  },

  async getAccountInfo(request, response){

    const nonce = crypto.randomBytes(16).toString('HEX')
    console.log(nonce)

    const opt = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const data = JSON.stringify({
        'nonce': nonce,
        'version': 'v1',
        'command': 'get-account-info',
        'user': wtUuid,
        'body': JSON.stringify({})
      })

    const bitcoinSignature = await bitcoincore.signMessage(data)

    const body = JSON.stringify({
      'bitcoin-address': publicKey,
      'bitcoin-signature': bitcoinSignature,
      'data': data
    })


    const messageBody = `MessageBody=${body}`

    const resp = await axios.post(queueUrl, messageBody, opt)
      .catch(error => {
        return response.json(error)
      });

      return response.json(resp.data)
  }

}

function buildBTCAmount(btcCount){

  const value = parseFloat(btcCount).toString()
  const arrValue =  value.split(".");

  const decimal = (arrValue[1] ? arrValue[1].length : 0);

  const multiplicator = '1'+'0'.repeat(decimal)

  const BTCAmount = Math.round(btcCount * parseFloat(multiplicator))

  return `${BTCAmount}/${multiplicator}`
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
