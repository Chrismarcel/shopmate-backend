import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get all departments endpoint GET /departments', () => {
  it('should return 200 if departments were returned successfully', (done) => {
    chai
      .request(app)
      .get('/departments')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0]).to.have.property('department_id');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('description');
        done(err);
      });
  });
});

describe('Test get a single department endpoint GET /departments/:department_id', () => {
  it('should return 200 if department was returned successfully', (done) => {
    chai
      .request(app)
      .get('/departments/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.department_id).to.equal('1');
        done(err);
      });
  });

  it('should return 400 if department id is not a number', (done) => {
    chai
      .request(app)
      .get('/departments/abc')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('DEP_01');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });

  it("should return 400 if department doesn't exist", (done) => {
    chai
      .request(app)
      .get('/departments/10000')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('DEP_02');
        expect(error.message).to.equal("Don't exist department with this ID.");
        done(err);
      });
  });
});
