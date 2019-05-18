import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get a products search endpoint GET /products/search?query_string', () => {
  it('should return 200 if products were returned successfully with additional valid query params', (done) => {
    chai
      .request(app)
      .get('/products/search?query_string=triumph&description_length=200&limit=20&page=1&all_words=on')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('should return 200 if products were returned successfully without additional valid query params', (done) => {
    chai
      .request(app)
      .get('/products/search?query_string=triumph')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('should return 400 if query_string param is not specified', (done) => {
    chai
      .request(app)
      .get('/products/search?')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PRD_01');
        expect(error.field).to.equal('query_string');
        done(err);
      });
  });
});
