import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

let customerToken;

describe('Test get customer profile endpoint GET /customer', () => {
  before((done) => {
    chai
      .request(app)
      .post('/customers/login')
      .send({
        email: 'user3@email.com',
        password: 'password123456'
      })
      .end((err, res) => {
        customerToken = res.body.accessToken;
        done(err);
      });
  });

  it('should return 200 if customer profile was returned successfully', (done) => {
    chai
      .request(app)
      .get('/customer')
      .set('user-key', customerToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('customer_id');
        expect(res.body.customer_id).to.equal(1);
        done(err);
      });
  });
});
