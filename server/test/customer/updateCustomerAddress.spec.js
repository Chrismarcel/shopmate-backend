import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

let customerToken;

const requestBody = {
  address_1: 'A random adress',
  address_2: 'Another random address',
  city: 'My City',
  region: 'My Region',
  postal_code: '123456',
  country: 'Spain',
  shipping_region_id: 1
};

describe('Test update customer address endpoint PUT /customers/address', () => {
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
      .put('/customers/address')
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
      .put('/customers/address')
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
      .put('/customers/address')
      .set('user-key', customerToken)
      .send(requestBody)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.address_1).to.equal(requestBody.address_1);
        expect(res.body.address_2).to.equal(requestBody.address_2);
        expect(res.body.city).to.equal(requestBody.city);
        expect(res.body.country).to.equal(requestBody.country);
        expect(res.body.region).to.equal(requestBody.region);
        expect(res.body.postal_code).to.equal(requestBody.postal_code);
        expect(res.body.shipping_region_id).to.equal(requestBody.shipping_region_id);
        done(err);
      });
  });
});
