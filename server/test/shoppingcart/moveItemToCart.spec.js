import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

let itemId;

describe('Test move item to cart endpoint GET /shoppingcart/moveToCart/item_id', () => {
  before(() => {
    itemId = global.cartItemId;
  });
  it('should return 200 if item was moved successfully', (done) => {
    chai
      .request(app)
      .get(`/shoppingcart/moveToCart/${itemId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('should return 400 if item id is not specified', (done) => {
    chai
      .request(app)
      .get('/shoppingcart/moveToCart/')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_01');
        expect(error.message).to.equal('The field(s) is/are required.');
        expect(error.field).to.equal('item_id');
        done(err);
      });
  });

  it('should return 400 if item id is invalid', (done) => {
    chai
      .request(app)
      .get('/shoppingcart/moveToCart/abc')
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_02');
        expect(error.message).to.equal('Item ID should be a number');
        expect(error.field).to.equal('item_id');
        done(err);
      });
  });
});
