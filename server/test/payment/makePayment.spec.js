import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test make payment endpoint POST /stripe/charge', () => {
  it('should return 200 if payment was successful', (done) => {
    chai
      .request(app)
      .post('/stripe/charge')
      .send({
        stripeToken: process.env.STRIPE_TOKEN,
        order_id: 10,
        amount: 10000,
        currency: 'USD',
        description: `Testing endpoint ${new Date()}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('should return 200 if currency is zero decimal', (done) => {
    chai
      .request(app)
      .post('/stripe/charge')
      .send({
        stripeToken: process.env.STRIPE_TOKEN,
        order_id: 10,
        amount: 1000,
        currency: 'JPY',
        description: `Testing endpoint ${new Date()}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('should return 400 if no token is specified', (done) => {
    chai
      .request(app)
      .post('/stripe/charge')
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done(err);
      });
  });

  it('should return 400 if no field request body contains invalid fields', (done) => {
    chai
      .request(app)
      .post('/stripe/charge')
      .send({
        stripeToken: process.env.STRIPE_TOKEN,
        order_id: 'gt',
        amount: 'abc',
        currency: 'USD',
        description: `Testing endpoint ${new Date()}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done(err);
      });
  });
});
