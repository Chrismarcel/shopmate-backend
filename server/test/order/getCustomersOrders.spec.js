import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

let customerToken;

describe('Test get customer orders endpoint GET /orders/inCustomer', () => {
  beforeEach((done) => {
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

  it('should return 401 if no authorization header', (done) => {
    chai
      .request(app)
      .get('/orders/inCustomer')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(401);
        expect(error.code).to.equal('AUT_01');
        expect(error.message).to.equal('Authorization code is empty.');
        expect(error.field).to.equal('NoAuth');
        done(err);
      });
  });

  it('should return 401 if authorization header is invalid', (done) => {
    chai
      .request(app)
      .get('/orders/inCustomer')
      .set('user-key', 'Bearer wrong-token')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(401);
        expect(error.code).to.equal('AUT_02');
        expect(error.message).to.equal('Access Unauthorized.');
        expect(error.field).to.equal('InvalidToken');
        done(err);
      });
  });

  it('should return 200 if authentication and validations are correct', (done) => {
    chai
      .request(app)
      .get('/orders/inCustomer')
      .set('user-key', customerToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0]).to.have.property('order_id');
        expect(res.body[0]).to.have.property('total_amount');
        expect(res.body[0]).to.have.property('created_on');
        expect(res.body[0]).to.have.property('shipped_on');
        expect(res.body[0]).to.have.property('status');
        expect(res.body[0]).to.have.property('name');
        done(err);
      });
  });
});
