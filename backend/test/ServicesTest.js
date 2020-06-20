const chai = require('chai');
const assert = chai.assert;
const bitcoincore = require('../src/services/BitcoinCore');
const helper = require('../src/services/Helper');

describe('Test BitcoinCore functions', function(){
  it('should sign message', async function(){
    const expectSignature =
      'HzxPOUwKaXC9q/mucNS7noq3eRVRLhJJQVeiNYy31bILCBFlzfwvjCg9FJiOo7yZbQ116LE18rJQ6EJY3Yx1LBY='
    const signature = await bitcoincore.signMessage('hello-word');

    assert.equal(signature, expectSignature);
  });
});

describe('Test Helper functions', function(){
  it('should replace special characters', function(done){
    const expectResponse = 'aaaaaeeeeeiiioooouuuc';
    const response = helper.replaceSpecialChars('aáàãâeéèẽêiíìoóòõuúùç');

    assert.equal(response, expectResponse);
    done();
  });
});

