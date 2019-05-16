import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../app';

chai.use(chaiHttp);

let customerToken;
let customerId;

describe('Test update customer profile endpoint PUT /customer', () => {
  beforeEach((done) => {
    chai
      .request(app)
      .post('/customers')
      .send({
        email: 'user2@email.com',
        name: 'User2',
        password: 'password12345'
      })
      .end((err, res) => {
        customerId = res.body.customer.customer_id;
        customerToken = res.body.accessToken;
        done(err);
      });
  });

  it('should return 200 if required details are correct', (done) => {
    const requestBody = {
      email: 'user3@email.com',
      name: 'User3',
      password: 'password123456',
      eve_phone: '08076587656',
      mob_phone: '08076587657',
      day_phone: '08076587658'
    };
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
