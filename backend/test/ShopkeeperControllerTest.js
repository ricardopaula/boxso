require('../src/services/GlobalBefore');
const chai = require('chai');
const server = require('../src/index');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('Test shopkeeper requests', function(){

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

  it('should create shopkeeper', function(done){
    chai.request(server)
      .post('/api/shopkeepers')
      .send(shopkeeperData)
      .end(function(err, res){
        res.should.have.status(200);
        expect(res.body).to.deep.equal({"ok": true});

        done();
      })
  });

  it('should list all shopkeepers', function(done){
    chai.request(server)
      .get('/api/shopkeepers')
      .end(function(err, res){
        res.should.have.status(200);

        expect(res.body[0].ownername).to.deep.equal(shopkeeperData.ownername);
        expect(res.body[0].fantasyname).to.deep.equal(shopkeeperData.fantasyname);
        expect(res.body[0].cpfcnpj).to.deep.equal(shopkeeperData.cpfcnpj);
        expect(res.body[0].email).to.deep.equal(shopkeeperData.email);
        expect(res.body[0].address).to.deep.equal(shopkeeperData.address);
        expect(res.body[0].addressnumber).to.deep.equal(shopkeeperData.addressnumber);
        expect(res.body[0].neighborhood).to.deep.equal(shopkeeperData.neighborhood);
        expect(res.body[0].city).to.deep.equal(shopkeeperData.city);
        expect(res.body[0].uf).to.deep.equal(shopkeeperData.uf);
        expect(res.body[0].phone).to.deep.equal(shopkeeperData.phone);
        expect(res.body[0].cell).to.deep.equal(shopkeeperData.cell);
        expect(res.body[0].bank).to.deep.equal(shopkeeperData.bank);
        expect(res.body[0].ag).to.deep.equal(shopkeeperData.ag);
        expect(res.body[0].cc).to.deep.equal(shopkeeperData.cc);
        expect(res.body[0].admin).to.equal(false);
        expect(res.body[0].active).to.deep.equal(true);

        done();
      })
  });

  it('should show shopkeeper', async function(){

    const dataResponse = await chai.request(server)
      .get('/api/shopkeepers');

    const userData = dataResponse.body[0];

    const res = await chai.request(server)
      .get(`/api/shopkeepers/show/${userData.uuid}`)

    res.should.have.status(200);

    expect(res.body.ownername).to.deep.equal(shopkeeperData.ownername);
    expect(res.body.fantasyname).to.deep.equal(shopkeeperData.fantasyname);
    expect(res.body.cpfcnpj).to.deep.equal(shopkeeperData.cpfcnpj);
    expect(res.body.email).to.deep.equal(shopkeeperData.email);
    expect(res.body.address).to.deep.equal(shopkeeperData.address);
    expect(res.body.addressnumber).to.deep.equal(shopkeeperData.addressnumber);
    expect(res.body.neighborhood).to.deep.equal(shopkeeperData.neighborhood);
    expect(res.body.city).to.deep.equal(shopkeeperData.city);
    expect(res.body.uf).to.deep.equal(shopkeeperData.uf);
    expect(res.body.phone).to.deep.equal(shopkeeperData.phone);
    expect(res.body.cell).to.deep.equal(shopkeeperData.cell);
    expect(res.body.bank).to.deep.equal(shopkeeperData.bank);
    expect(res.body.ag).to.deep.equal(shopkeeperData.ag);
    expect(res.body.cc).to.deep.equal(shopkeeperData.cc);
    expect(res.body.admin).to.equal(false);
    expect(res.body.active).to.deep.equal(true);
  });

  it('should updated shopkeeper', async function(){
    const dataResponse = await chai.request(server)
      .get('/api/shopkeepers');

    const userData = dataResponse.body[0];

    const updatedData =
      {
        "ownername": "Joao Santos",
        "fantasyname": "Padaria do Joao Santos",
        "cpfcnpj": "11.111.111/1111-11",
        "email": "padaria@joaosantos.com",
        "password": "teste1234",
        "address": "Rua Sao Paulo",
        "addressnumber": "100",
        "neighborhood": "LJ 10",
        "city": "Niteroi",
        "uf": "RJ",
        "phone": "21 0000-0000",
        "cell": "21 90000-0000",
        "bank": "Caixa",
        "ag": "9876",
        "cc": "54321",
        "admin": true,
        "active": false
      }

    var res = await chai.request(server)
      .put(`/api/shopkeepers/${userData.uuid}`)
      .send(updatedData)

    res.should.have.status(200);
    expect(res.body).to.deep.equal({"ok": true});

    res = await chai.request(server)
      .get(`/api/shopkeepers/show/${userData.uuid}`)

    res.should.have.status(200);

    expect(res.body.ownername).to.deep.equal(updatedData.ownername);
    expect(res.body.fantasyname).to.deep.equal(updatedData.fantasyname);
    expect(res.body.cpfcnpj).to.deep.equal(updatedData.cpfcnpj);
    expect(res.body.email).to.deep.equal(updatedData.email);
    expect(res.body.address).to.deep.equal(updatedData.address);
    expect(res.body.addressnumber).to.deep.equal(updatedData.addressnumber);
    expect(res.body.neighborhood).to.deep.equal(updatedData.neighborhood);
    expect(res.body.city).to.deep.equal(updatedData.city);
    expect(res.body.uf).to.deep.equal(updatedData.uf);
    expect(res.body.phone).to.deep.equal(updatedData.phone);
    expect(res.body.cell).to.deep.equal(updatedData.cell);
    expect(res.body.bank).to.deep.equal(updatedData.bank);
    expect(res.body.ag).to.deep.equal(updatedData.ag);
    expect(res.body.cc).to.deep.equal(updatedData.cc);
    expect(res.body.admin).to.equal(true);
    expect(res.body.active).to.deep.equal(false);
  });
});
