// const axios = require('axios')

// const blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3)
const blockexplorer = null

module.exports = {

  async checkTransaction (address) {
    const options = null

    try {
      // return await blockexplorer.getAddress(address, options)
      return await blockexplorer.getBalance(address, options)
    } catch (err) {
      return err
    }
  },

  async check (request, response) {
    const address = '2MwjcboFNf1dZCV64eiGAFnF6nSZPXW6MsW'
    const options = null

    const ret = await blockexplorer.getAddress(address, options)

    return response.json(ret)
  }

}
