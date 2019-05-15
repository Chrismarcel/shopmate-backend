import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../app';

chai.use(chaiHttp);

describe('Test required fields', () => {
  it('should return 200 if registration details are correct', (done) => {
    chai
      .request(app)
      .post('/customer')
      .send({
        email: 'user1@email.com',
        name: 'User1',
        password: 'password12345'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('accessToken');
        expect(res.body.schema).to.be.an('object');
        expect(res.body.expires_in).to.equal('24h');
        done(err);
      });
  });

  it('should return a 400 if required fields are omitted', (done) => {
    chai
      .request(app)
      .post('/customer')
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal('USR_02');
        done(err);
      });
  });
});
