import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get categories in a department endpoint GET /categories/inDepartment/:department_id', () => {
  it('should return 200 if products were returned successfully', (done) => {
    chai
      .request(app)
      .get('/categories/inDepartment/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0]).to.have.property('category_id');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('description');
        done(err);
      });
  });

  it('should return 400 if department id is not a number', (done) => {
    chai
      .request(app)
      .get('/categories/inDepartment/ab')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('DEP_01');
        expect(error.field).to.equal('department_id');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });

  it('should return 400 if department id is not specified', (done) => {
    chai
      .request(app)
      .get('/categories/inDepartment/')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('DEP_01');
        expect(error.field).to.equal('department_id');
        expect(error.message).to.equal('The field is required');
        done(err);
      });
  });
});
