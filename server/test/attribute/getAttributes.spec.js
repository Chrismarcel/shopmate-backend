import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get all attributes endpoint GET /attributes', () => {
  it('should return 200 if attributes were returned successfully', (done) => {
    chai
      .request(app)
      .get('/attributes')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0]).to.have.property('attribute_id');
        expect(res.body[0]).to.have.property('name');
        done(err);
      });
  });
});

describe('Test get a single attribute endpoint GET /attribute/:attribute_id', () => {
  it('should return 200 if attribute was returned successfully', (done) => {
    chai
      .request(app)
      .get('/attributes/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('attribute_id');
        expect(res.body).to.have.property('name');
        done(err);
      });
  });

  it('should return 400 if attribute id is not a number', (done) => {
    chai
      .request(app)
      .get('/attributes/abc')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('ATT_01');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });

  it("should return 400 if attribute doesn't exist", (done) => {
    chai
      .request(app)
      .get('/attributes/0')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('ATT_02');
        expect(error.message).to.equal("Don't exist attribute with this ID.");
        done(err);
      });
  });
});

describe('Test get a single attribute vakues endpoint GET /attribute/values/:attribute_id', () => {
  it('should return 200 if atrribute values were returned successfully', (done) => {
    chai
      .request(app)
      .get('/attributes/values/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0]).to.have.property('attribute_value_id');
        expect(res.body[0]).to.have.property('value');
        done(err);
      });
  });

  it('should return 400 if attribute id is not a number', (done) => {
    chai
      .request(app)
      .get('/attributes/abc')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('ATT_01');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });

  it("should return 400 if attribute doesn't exist", (done) => {
    chai
      .request(app)
      .get('/attributes/values/0')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('ATT_02');
        expect(error.message).to.equal("Don't exist attribute with this ID.");
        done(err);
      });
  });
});

describe('Test get attribues in a product endpoint GET /attributes/inProduct/:product_id', () => {
  it('should return 200 if products were returned successfully', (done) => {
    chai
      .request(app)
      .get('/attributes/inProduct/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0]).to.have.property('attribute_name');
        expect(res.body[0]).to.have.property('attribute_value_id');
        expect(res.body[0]).to.have.property('attribute_value');
        done(err);
      });
  });

  it('should return 400 if product id is not a number', (done) => {
    chai
      .request(app)
      .get('/attributes/inProduct/ab')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PRD_01');
        expect(error.field).to.equal('product_id');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });
});
