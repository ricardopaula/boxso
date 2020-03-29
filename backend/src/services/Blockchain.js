// const axios = require('axios')

// const blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3)

module.exports = {

  async checkTransaction(address){
    options = null;


    try {
      // return await blockexplorer.getAddress(address, options)
      return await blockexplorer.getBalance(address, options)

    } catch (err) {
      return err;
    }
  },

  async check(request, response) {
    address = '2MwjcboFNf1dZCV64eiGAFnF6nSZPXW6MsW';
    options = null;

    ret = await blockexplorer.getAddress(address, options)
    console.log('Retorno:')
    console.log(ret)

    return response.json(ret);
  }

}
