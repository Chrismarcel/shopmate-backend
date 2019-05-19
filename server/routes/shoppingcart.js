import express from 'express';
import { ShoppingCartController } from '../controllers';
import { ValidateShoppingCart, ValidateProduct } from '../middlewares';
import Validator from '../helpers/validators/fieldValidators';

const shoppingRoute = express.Router();

shoppingRoute.get('/shoppingcart/generateUniqueId', ShoppingCartController.generateCartId);

shoppingRoute.post('/shoppingcart/add',
  Validator.validateAddToCartFields(),
  ValidateShoppingCart.validateShoppingCart,
  Validator.validateId('product_id'),
  ValidateProduct.validateProduct,
  ShoppingCartController.addToCart);

export default shoppingRoute;
