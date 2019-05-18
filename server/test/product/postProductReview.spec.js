import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

let customerToken;

describe('Test post reviews endpoint POST /products/:product_id/reviews', () => {
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
      .post('/products/1/reviews')
      .send({ review: 'Random review', rating: 4 })
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
      .post('/products/1/reviews')
      .set('user-key', 'Bearer wrong-token')
      .send({ review: 'Random review', rating: 4 })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(401);
        expect(error.code).to.equal('AUT_02');
        expect(error.message).to.equal('Access Unauthorized.');
        expect(error.field).to.equal('InvalidToken');
        done(err);
      });
  });

  it('should return 200 if review fields are correct', (done) => {
    chai
      .request(app)
      .post('/products/1/reviews')
      .set('user-key', customerToken)
      .send({ review: 'Random rating', rating: 4 })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('should return 400 if review is not specified', (done) => {
    chai
      .request(app)
      .post('/products/1/reviews')
      .set('user-key', customerToken)
      .send({ rating: 4 })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PRD_03');
        expect(error.message).to.equal('The field review is empty');
        expect(error.field).to.equal('review');
        done(err);
      });
  });

  it('should return 400 if rating is invalid', (done) => {
    chai
      .request(app)
      .post('/products/1/reviews')
      .set('user-key', customerToken)
      .send({ review: 'Random review', rating: 'ytjj' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PRD_04');
        expect(error.message).to.equal('Field is invalid, should be integer between 1 to 5');
        expect(error.field).to.equal('rating');
        done(err);
      });
  });

  it('should return 400 if rating is not a number', (done) => {
    chai
      .request(app)
      .post('/products/1/reviews')
      .set('user-key', customerToken)
      .send({ review: 'Random review' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PRD_04');
        expect(error.message).to.equal('The field rating is empty');
        expect(error.field).to.equal('rating');
        done(err);
      });
  });
});
