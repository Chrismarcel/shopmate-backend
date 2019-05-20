import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import app from '../../app';

chai.use(chaiHttp);

describe('generate unique id', () => {
  it('should generate a unique string', (done) => {
    chai
      .request(app)
      .get('/shoppingcart/generateUniqueId')
      .end((err, res) => {
        global.cartId = res.body.cart_id;
        expect(global.cartId.length).to.equal(32);
        done(err);
      });
  });
});

describe('Test add to cart endpoint POST /shoppingcart/add', () => {
  it('should return 200 if item was added successfully', (done) => {
    chai
      .request(app)
      .post('/shoppingcart/add')
      .send({
        cart_id: global.cartId,
        product_id: Math.ceil(Math.random() * 101),
        attributes: 'Green, Red'
      })
      .end((err, res) => {
        global.cartItemId = res.body[0].item_id;
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

  it('should return 400 if cart id is not specified', (done) => {
    chai
      .request(app)
      .post('/shoppingcart/add')
      .send({
        product_id: 1,
        attributes: 'Green, Red'
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_01');
        expect(error.message).to.equal('The field(s) is/are required.');
        expect(error.field).to.equal('cart_id');
        done(err);
      });
  });

  it('should return 400 if product id is not specified', (done) => {
    chai
      .request(app)
      .post('/shoppingcart/add')
      .send({
        cart_id: global.cartId,
        attributes: 'Green, Red'
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PRD_01');
        expect(error.message).to.equal('The field(s) is/are required.');
        expect(error.field).to.equal('product_id');
        done(err);
      });
  });

  it('should return 400 if attributes is not specified', (done) => {
    chai
      .request(app)
      .post('/shoppingcart/add')
      .send({
        cart_id: global.cartId,
        product_id: 1
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('CRT_01');
        expect(error.message).to.equal('The field(s) is/are required.');
        expect(error.field).to.equal('attributes');
        done(err);
      });
  });

  it('should return 400 if product id is invalid', (done) => {
    chai
      .request(app)
      .post('/shoppingcart/add')
      .send({
        cart_id: global.cartId,
        product_id: 'ahksj',
        attributes: 'Green, Red'
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error.code).to.equal('PRD_02');
        expect(error.message).to.equal('Product ID should be a number');
        expect(error.field).to.equal('product_id');
        done(err);
      });
  });
});
