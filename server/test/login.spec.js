import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../app';

chai.use(chaiHttp);

describe('Test registration endpoint POST /customers/login', () => {
  it('should return 200 if registration details are correct', (done) => {
    chai
      .request(app)
      .post('/customers/login')
      .send({
        email: 'user1@email.com',
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

  it('should return a 400 and error message if required fields are omitted', (done) => {
    chai
      .request(app)
      .post('/customers/login')
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error.code).to.equal('USR_02');
        done(err);
      });
  });

  it('should return a 400 and an error message if email field is invalid', (done) => {
    chai
      .request(app)
      .post('/customers/login')
      .send({ email: 'user1@', name: 'User1', password: 'password12345' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('USR_03');
        expect(error.message).to.equal('The email is invalid.');
        expect(error.field).to.equal('email');
        done(err);
      });
  });

  it('should return a 400 and an error message if email field is too long', (done) => {
    chai
      .request(app)
      .post('/customers/login')
      .send({ email: 'user1@'.repeat(50), name: 'User1', password: 'password12345' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('USR_03');
        expect(error.message).to.equal('The length is too long email');
        expect(error.field).to.equal('email');
        done(err);
      });
  });

  it('should return a 400 and error message if email or password is invalid', (done) => {
    chai
      .request(app)
      .post('/customers/login')
      .send({
        email: 'user3@email.com',
        password: 'password12345'
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('USR_01');
        expect(error.message).to.equal('Email or Password is invalid');
        expect(error.field).to.equal('email, password');
        done(err);
      });
  });
});
