import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get all categories endpoint GET /categories', () => {
  it('should return 200 if all categories were returned successfully', (done) => {
    chai
      .request(app)
      .get('/categories')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.rows[0]).to.have.property('category_id');
        expect(res.body.rows[0]).to.have.property('name');
        expect(res.body.rows[0]).to.have.property('description');
        done(err);
      });
  });
});

describe('Test get a single category endpoint GET /categories/:category_id', () => {
  it('should return 200 if category was returned successfully', (done) => {
    chai
      .request(app)
      .get('/categories/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.category_id).to.equal('1');
        done(err);
      });
  });

  it('should return 400 if category id is not a number', (done) => {
    chai
      .request(app)
      .get('/categories/abc')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CAT_02');
        expect(error.field).to.equal('category_id');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });

  it("should return 400 if category doesn't exist", (done) => {
    chai
      .request(app)
      .get('/categories/10000')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CAT_01');
        expect(error.field).to.equal('category_id');
        expect(error.message).to.equal("Don't exist category with this ID.");
        done(err);
      });
  });
});

describe('Test get a category sort order endpoint GET /categories?order', () => {
  it('should return 200 if categories was returned successfully', (done) => {
    chai
      .request(app)
      .get('/categories?order=name,ASC')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.rows[0]).to.have.property('category_id');
        expect(res.body.rows[0]).to.have.property('name');
        expect(res.body.rows[0]).to.have.property('description');
        done(err);
      });
  });

  it('should return 400 if order is not valid format', (done) => {
    chai
      .request(app)
      .get('/categories?order=nam')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PAG_01');
        expect(error.message).to.equal("The order is not matched 'field,(DESC|ASC).'");
        done(err);
      });
  });

  it('should return 400 if field cannot be sorted', (done) => {
    chai
      .request(app)
      .get('/categories?order=description,ASC')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PAG_02');
        expect(error.message).to.equal('The field of order is not allow sorting.');
        done(err);
      });
  });
});

describe('Test get products in a category endpoint GET /categories/inProduct/:product_id', () => {
  it('should return 200 if products were returned successfully', (done) => {
    chai
      .request(app)
      .get('/categories/inProduct/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.rows[0]).to.have.property('product_id');
        expect(res.body.rows[0]).to.have.property('name');
        expect(res.body.rows[0]).to.have.property('description');
        expect(res.body.rows[0]).to.have.property('price');
        expect(res.body.rows[0]).to.have.property('discounted_price');
        done(err);
      });
  });

  it('should return 400 if category id is not a number', (done) => {
    chai
      .request(app)
      .get('/categories/inProduct/1')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CAT_02');
        expect(error.field).to.equal('category_id');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });
});
