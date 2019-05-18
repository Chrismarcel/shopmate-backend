import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get additional product details endpoint GET /products/product_id/*', () => {
  it('should return 200 if products details were returned successfully', (done) => {
    chai
      .request(app)
      .get('/products/1/details')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0].product_id).to.equal(1);
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('description');
        expect(res.body[0]).to.have.property('price');
        expect(res.body[0]).to.have.property('discounted_price');
        expect(res.body[0]).to.have.property('image');
        expect(res.body[0]).to.have.property('image_2');
        done(err);
      });
  });

  it('should return 200 if products locations were returned successfully', (done) => {
    chai
      .request(app)
      .get('/products/1/locations')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0].category_id).to.equal(1);
        expect(res.body[0]).to.have.property('category_name');
        expect(res.body[0]).to.have.property('department_id');
        expect(res.body[0]).to.have.property('department_name');
        done(err);
      });
  });

  it('should return 200 if products reviews were returned successfully', (done) => {
    chai
      .request(app)
      .get('/products/1/reviews')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });
});
