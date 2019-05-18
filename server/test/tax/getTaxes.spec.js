import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get all taxes endpoint GET /tax', () => {
  it('should return 200 if taxes were returned successfully', (done) => {
    chai
      .request(app)
      .get('/tax')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0]).to.have.property('tax_id');
        expect(res.body[0]).to.have.property('tax_type');
        expect(res.body[0]).to.have.property('tax_percentage');
        done(err);
      });
  });
});

describe('Test get a single tax endpoint GET /tax/:tax_id', () => {
  it('should return 200 if tax was returned successfully', (done) => {
    chai
      .request(app)
      .get('/tax/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.tax_id).to.equal(1);
        done(err);
      });
  });

  it('should return 400 if tax id is not a number', (done) => {
    chai
      .request(app)
      .get('/tax/abc')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('TAX_01');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });

  it("should return 400 if tax doesn't exist", (done) => {
    chai
      .request(app)
      .get('/tax/0')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('TAX_02');
        expect(error.message).to.equal("Don't exist tax with this ID.");
        done(err);
      });
  });
});
