import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get all shipping regions endpoint GET /shipping/regions', () => {
  it('should return 200 if shipping results were returned successfully', (done) => {
    chai
      .request(app)
      .get('/shipping/regions')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0]).to.have.property('shipping_region_id');
        expect(res.body[0]).to.have.property('shipping_region');
        done(err);
      });
  });
});

describe('Test get a shipping region endpoint GET /shipping/regions/:shipping_region_id', () => {
  it('should return 200 if shipping was returned successfully', (done) => {
    chai
      .request(app)
      .get('/shipping/regions/2')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0].shipping_region_id).to.equal(2);
        expect(res.body[0]).to.have.property('shipping_cost');
        expect(res.body[0]).to.have.property('shipping_type');
        expect(res.body[0]).to.have.property('shipping_id');
        done(err);
      });
  });

  it('should return 400 if shipping id is not a number', (done) => {
    chai
      .request(app)
      .get('/shipping/regions/abc')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('SHP_01');
        expect(error.message).to.equal('The ID is not a number.');
        done(err);
      });
  });
});
