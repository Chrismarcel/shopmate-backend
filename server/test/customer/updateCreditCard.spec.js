import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

let customerToken;

const requestBody = {
  credit_card: process.env.CC_ID
};

describe('Test update customer credit card endpoint PUT /customers/creditCard', () => {
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

  it('should return 401 if no authorization header', (done) => {
    chai
      .request(app)
      .put('/customers/creditCard')
      .send(requestBody)
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
      .put('/customers/creditCard')
      .set('user-key', 'Bearer wrong-token')
      .send(requestBody)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(401);
        expect(error.code).to.equal('AUT_02');
        expect(error.message).to.equal('Access Unauthorized.');
        expect(error.field).to.equal('InvalidToken');
        done(err);
      });
  });

  it('should return 200 if required details are correct', (done) => {
    chai
      .request(app)
      .put('/customers/creditCard')
      .set('user-key', customerToken)
      .send(requestBody)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.credit_card).to.equal(requestBody.credit_card);
        done(err);
      });
  });

  it('should return 400 if credit card is invalid', (done) => {
    chai
      .request(app)
      .put('/customers/creditCard')
      .set('user-key', customerToken)
      .send({ credit_card: '1234 5678 9087 6543' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('USR_08');
        expect(error.message).to.equal('This is an invalid Credit Card.');
        expect(error.field).to.equal('credit_card');
        done(err);
      });
  });
});
