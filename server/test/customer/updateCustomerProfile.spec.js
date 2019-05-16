import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

let customerToken;
let customerId;

const requestBody = {
  email: 'user3@email.com',
  name: 'User3',
  password: 'password123456',
  eve_phone: '08076587656',
  mob_phone: '08076587657',
  day_phone: '08076587658'
};

describe('Test update customer profile endpoint PUT /customer', () => {
  beforeEach((done) => {
    chai
      .request(app)
      .post('/customers/login')
      .send({
        email: 'user1@email.com',
        password: 'password12345'
      })
      .end((err, res) => {
        customerId = res.body.customer.customer_id;
        customerToken = res.body.accessToken;
        done(err);
      });
  });

  it('should return 401 if no authorization header', (done) => {
    chai
      .request(app)
      .put('/customer')
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
      .put('/customer')
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
      .put('/customer')
      .set('user-key', customerToken)
      .send(requestBody)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.email).to.equal(requestBody.email);
        expect(res.body.name).to.equal(requestBody.name);
        expect(res.body.eve_phone).to.equal(requestBody.eve_phone);
        expect(res.body.day_phone).to.equal(requestBody.day_phone);
        expect(res.body.mob_phone).to.equal(requestBody.mob_phone);
        expect(res.body.customer_id).to.equal(customerId);
        done(err);
      });
  });
});
