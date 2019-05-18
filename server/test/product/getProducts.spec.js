import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get all products endpoint GET /products', () => {
  it('should return 200 if products were returned successfully', (done) => {
    chai
      .request(app)
      .get('/products')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.rows[0]).to.have.property('product_id');
        expect(res.body.rows[0]).to.have.property('name');
        expect(res.body.rows[0]).to.have.property('description');
        expect(res.body.rows[0]).to.have.property('price');
        expect(res.body.rows[0]).to.have.property('discounted_price');
        expect(res.body.rows[0]).to.have.property('image');
        expect(res.body.rows[0]).to.have.property('image_2');
        expect(res.body.rows[0]).to.have.property('thumbnail');
        expect(res.body.rows[0]).to.have.property('display');
        done(err);
      });
  });
});

describe('Test get a single products endpoint GET /products/:product_id', () => {
  it('should return 200 if products was returned successfully', (done) => {
    chai
      .request(app)
      .get('/products/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.product_id).to.equal(1);
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('discounted_price');
        expect(res.body).to.have.property('image');
        expect(res.body).to.have.property('image_2');
        expect(res.body).to.have.property('thumbnail');
        expect(res.body).to.have.property('display');
        done(err);
      });
  });

  it('should return 400 if product id is not a number', (done) => {
    chai
      .request(app)
      .get('/products/abc')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PRD_01');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });

  it("should return 400 if product doesn't exist", (done) => {
    chai
      .request(app)
      .get('/products/0')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PRD_02');
        expect(error.message).to.equal("Don't exist product with this ID.");
        done(err);
      });
  });
});
