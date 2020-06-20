require('../src/services/GlobalBefore');
const chai = require('chai');
const server = require('../src/index');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Test session request', function(){
  before(async () => {
    const shopkeeperData =
      {
        "ownername": "Joao Silva",
        "fantasyname": "Padaria do Joao",
        "cpfcnpj": "00.000.000/0000-00",
        "email": "padaria@joao.com",
        "password": "teste123",
        "address": "Rua Brasil",
        "addressnumber": "23",
        "neighborhood": "LJ 5",
        "city": "São José dos Campos",
        "uf": "SP",
        "phone": "00 0000-0000",
        "cell": "12 98877-1457",
        "bank": "Itau",
        "ag": "0123",
        "cc": "456789"
      }

    await chai.request(server)
      .post('/api/shopkeepers')
      .send(shopkeeperData)
  });

  it('should do login', async function(){
    const dataResponse = await chai.request(server)
      .get('/api/shopkeepers');

    const userData = dataResponse.body[0];

    const dataLogin =
      {
        "email": "padaria@joao.com",
        "password": "teste123"
      }

    const response =
      {
        "type": "LOGIN_SUCESSFULL",
        "uuid": userData.uuid,
        "fantasyname": "Padaria do Joao",
        "admin": false
      }

    const resp = await chai.request(server)
      .post('/api/sessions')
      .send(dataLogin)

    expect(resp.body).to.deep.equal(response);
  });

  it('should validate credentials', async function(){
    const dataResponse = await chai.request(server)
      .get('/api/shopkeepers');

    const userData = dataResponse.body[0];

    const expectResponse = {
      "type": "CREDENTIALS_OK",
      "fantasyname": "Padaria do Joao",
      "cpfcnpj": "00.000.000/0000-00"
    };

    const resp = await chai.request(server)
      .get('/api/sessions/check-credentials')
      .set('apikey', userData.apikey)
      .set('apiid', userData.apiid)

    expect(resp.body).to.deep.equal(expectResponse);
  });
});
