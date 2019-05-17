import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('Testing the base [/] endpoint ', () => {
  it('should return a status code of 200', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome to Shopmate');
        done(err);
      });
  });
});

describe('Testing non-existent routes ', () => {
  it('should return a status code of 404', (done) => {
    chai
      .request(app)
      .get('/wrong-endpoint')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('Route not found');
        done(err);
      });
  });
});
