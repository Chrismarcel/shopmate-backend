import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test empty cart endpoint DELETE /shoppingcart/:cart_id', () => {
  // before();
  it('should return 200 if deletion was successfully', (done) => {
    chai
      .request(app)
      .delete(`/shoppingcart/${global.cartId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal([]);
        done(err);
      });
  });

  it("should return 400 if cart id doesn't exist", (done) => {
    chai
      .request(app)
      .delete('/shoppingcart/0')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_02');
        expect(error.message).to.equal("Don't exist cart with this ID.");
        expect(error.field).to.equal('cart_id');
        done(err);
      });
  });

  it('should return 400 if no cart id was specified', (done) => {
    chai
      .request(app)
      .delete('/shoppingcart/')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_01');
        expect(error.message).to.equal('The field(s) is/are required.');
        expect(error.field).to.equal('cart_id');
        done(err);
      });
  });
});
