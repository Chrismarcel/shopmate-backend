import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('Test get cart items endpoint GET /shoppingcart/:cart_id', () => {
  it('should return 200 if items were returned successfully', (done) => {
    chai
      .request(app)
      .get(`/shoppingcart/${global.cartId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('quantity');
        expect(res.body[0]).to.have.property('price');
        expect(res.body[0]).to.have.property('item_id');
        expect(res.body[0]).to.have.property('attributes');
        expect(res.body[0]).to.have.property('subtotal');
        done(err);
      });
  });

  it("should return 400 if item with given cart id doesn't exist", (done) => {
    chai
      .request(app)
      .get('/shoppingcart/0')
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
      .get('/shoppingcart/')
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
