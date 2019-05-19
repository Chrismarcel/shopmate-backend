import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

let customerToken;

describe('Test post orders endpoint POST /orders', () => {
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
      .post('/orders')
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
      .post('/orders')
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
      .post('/orders')
      .set('user-key', customerToken)
      .send({ shipping_id: 1, tax_id: '1', cart_id: 1 })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('orderId');
        done(err);
      });
  });

  it('should return 400 if shipping_id is not specified', (done) => {
    chai
      .request(app)
      .post('/orders')
      .set('user-key', customerToken)
      .send({ cart_id: `cart-${Date.now()}`, tax_id: '1' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('ORD_03');
        expect(error.message).to.equal('The field shipping_id is empty');
        expect(error.field).to.equal('shipping_id');
        done(err);
      });
  });

  it('should return 400 if cart_id is not specified', (done) => {
    chai
      .request(app)
      .post('/orders')
      .set('user-key', customerToken)
      .send({ shipping_id: '1', tax_id: '1' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('ORD_02');
        expect(error.message).to.equal('The field cart_id is empty');
        expect(error.field).to.equal('cart_id');
        done(err);
      });
  });

  it('should return 400 if tax_id is not specified', (done) => {
    chai
      .request(app)
      .post('/orders')
      .set('user-key', customerToken)
      .send({ cart_id: `cart-${Date.now()}`, shipping_id: '1' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('ORD_03');
        expect(error.message).to.equal('The field tax_id is empty');
        expect(error.field).to.equal('tax_id');
        done(err);
      });
  });

  it('should return 400 if shipping_id is invalid', (done) => {
    chai
      .request(app)
      .post('/orders')
      .set('user-key', customerToken)
      .send({ cart_id: `cart-${Date.now()}`, tax_id: '1', shipping_id: '1as' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('ORD_03');
        expect(error.message).to.equal('Shipping ID should be a number');
        expect(error.field).to.equal('shipping_id');
        done(err);
      });
  });

  it('should return 400 if tax_id is invalid', (done) => {
    chai
      .request(app)
      .post('/orders')
      .set('user-key', customerToken)
      .send({ cart_id: `cart-${Date.now()}`, tax_id: '1asr', shipping_id: '1' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('ORD_03');
        expect(error.message).to.equal('Tax ID should be a number');
        expect(error.field).to.equal('tax_id');
        done(err);
      });
  });
});
