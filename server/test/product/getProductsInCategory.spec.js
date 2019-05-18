import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get products in a category endpoint GET /products/inCategory/:category_id', () => {
  it('should return 200 if products were returned successfully', (done) => {
    chai
      .request(app)
      .get('/products/inCategory/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.rows[0]).to.have.property('product_id');
        expect(res.body.rows[0]).to.have.property('name');
        expect(res.body.rows[0]).to.have.property('description');
        expect(res.body.rows[0]).to.have.property('price');
        expect(res.body.rows[0]).to.have.property('discounted_price');
        expect(res.body.rows[0]).to.have.property('thumbnail');
        done(err);
      });
  });

  it('should return 200 if additional params are added and products were returned successfully', (done) => {
    chai
      .request(app)
      .get('/products/inCategory/1?limit=20&page=1&description_length=200')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.rows[0]).to.have.property('product_id');
        expect(res.body.rows[0]).to.have.property('name');
        expect(res.body.rows[0]).to.have.property('description');
        expect(res.body.rows[0]).to.have.property('price');
        expect(res.body.rows[0]).to.have.property('discounted_price');
        expect(res.body.rows[0]).to.have.property('thumbnail');
        done(err);
      });
  });

  it('should return 400 if category id is not a number', (done) => {
    chai
      .request(app)
      .get('/products/inCategory/ab')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CAT_02');
        expect(error.field).to.equal('category_id');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });

  it('should return 400 if category id is not specified', (done) => {
    chai
      .request(app)
      .get('/products/inCategory/')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CAT_01');
        expect(error.field).to.equal('category_id');
        expect(error.message).to.equal('The field is required');
        done(err);
      });
  });
});
