require('../src/services/GlobalBefore');

const chai = require('chai');
const server = require('../src/index');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const nock = require('nock')

chai.use(chaiHttp);

describe('Test order request', function(){

  const respOrder = [];

  it('should list all orders', function(done){
    chai.request(server)
      .get('/api/orders')
      .end(function(err, res){
        res.should.have.status(200);
        expect(res.body).to.deep.equal(respOrder);

        done();
      })
  });
});


describe('Test order request2', function(){
  this.beforeAll(() => {
    const response = {
      data: {
        BRL_XBT: {
          last_inexact: 1
        }
      }
    }
    nock('https://s3.amazonaws.com/response-production-walltime-info/production/')
    .get('index/')
    .reply(200, response);
  })

  const response2 = {
    data: {
      BRL_XBT: {
        last_inexact: 1
      }
    }
  }
  nock('https://s3.amazonaws.com/data-production-walltime-info/production/dynamic')
  .get('/walltime-info.json?now=1528962473468.679.0000000000873')
  .reply(200, response);
})


  it('should list all orders', async () => {
    resp = await chai.request(server)
    .get('/api/orders/teste')
    // .end(function(err, res){
    //   res.should.have.status(200);
    //   expect(res.body).to.deep.equal({statuss: true});

    // })

    resp.should.have.status(200);
    expect(resp.body).to.deep.equal({statuss: true});
  });
});
