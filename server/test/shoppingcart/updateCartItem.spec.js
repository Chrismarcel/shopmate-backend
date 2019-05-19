import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

let itemId;

describe('Test update cart item endpoint PUT /shoppingcart/update/item_id', () => {
  before(() => {
    itemId = global.cartItemId;
  });
  it('should return 200 if item was updated successfully', (done) => {
    chai
      .request(app)
      .put(`/shoppingcart/update/${itemId}`)
      .send({
        quantity: 10
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body[0].quantity).to.equal(10);
        expect(res.body[0].item_id).to.equal(itemId);
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('price');
        expect(res.body[0]).to.have.property('item_id');
        expect(res.body[0]).to.have.property('attributes');
        expect(res.body[0]).to.have.property('subtotal');
        done(err);
      });
  });

  it('should return 400 if item id is not specified', (done) => {
    chai
      .request(app)
      .put('/shoppingcart/update/')
      .send({
        quantity: 10
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_02');
        expect(error.message).to.equal('The field item_id is empty.');
        expect(error.field).to.equal('item_id');
        done(err);
      });
  });

  it('should return 400 if item id is invalid', (done) => {
    chai
      .request(app)
      .put('/shoppingcart/update/abc')
      .send({
        quantity: 10
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_02');
        expect(error.message).to.equal('Item ID should be a number');
        expect(error.field).to.equal('item_id');
        done(err);
      });
  });

  it('should return 400 if quantity is not specified', (done) => {
    chai
      .request(app)
      .put(`/shoppingcart/update/${itemId}`)
      .send({})
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_02');
        expect(error.message).to.equal('The field quantity is empty.');
        expect(error.field).to.equal('quantity');
        done(err);
      });
  });

  it('should return 400 if quantity is invalid', (done) => {
    chai
      .request(app)
      .put(`/shoppingcart/update/${itemId}`)
      .send({ quantity: 'bab' })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_02');
        expect(error.message).to.equal('Quantity should be a number');
        expect(error.field).to.equal('quantity');
        done(err);
      });
  });
});
