require('../src/services/GlobalBefore');

const chai = require('chai');
const server = require('../src/index');
const chaiHttp = require('chai-http');
const expect = chai.expect;

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
