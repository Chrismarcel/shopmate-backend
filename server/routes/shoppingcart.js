import express from 'express';
import { ShoppingCartController } from '../controllers';
import { ValidateShoppingCart, ValidateProduct } from '../middlewares';
import Validator from '../helpers/validators/fieldValidators';

const shoppingRoute = express.Router();

shoppingRoute.get('/shoppingcart/generateUniqueId', ShoppingCartController.generateCartId);

shoppingRoute.get('/shoppingcart/moveToCart/:item_id?',
  Validator.validateItemId(),
  ValidateShoppingCart.validateShoppingCart,
  ShoppingCartController.moveItemToCart);

shoppingRoute.get('/shoppingcart/saveForLater/:item_id?',
  Validator.validateItemId(),
  ValidateShoppingCart.validateShoppingCart,
  ShoppingCartController.saveForLater);

shoppingRoute.delete('/shoppingcart/removeProduct/:item_id?',
  Validator.validateItemId(),
  ValidateShoppingCart.validateShoppingCart,
  ShoppingCartController.removeItemFromCart);

shoppingRoute.get('/shoppingcart/totalAmount/:cart_id?',
  Validator.validateCartId(),
  ValidateShoppingCart.validateShoppingCart,
  ShoppingCartController.getTotalAmount);

shoppingRoute.get('/shoppingcart/getSaved/:cart_id?',
  Validator.validateCartId(),
  ValidateShoppingCart.validateShoppingCart,
  ShoppingCartController.getSavedItems);

shoppingRoute.get('/shoppingcart/:cart_id?',
  Validator.validateCartId(),
  ValidateShoppingCart.validateShoppingCart,
  ShoppingCartController.getItemsInCart);

shoppingRoute.delete('/shoppingcart/:cart_id?',
  Validator.validateCartId(),
  ValidateShoppingCart.validateShoppingCart,
  ShoppingCartController.emptyCart);

shoppingRoute.put('/shoppingcart/update/:item_id?',
  Validator.validateUpdateCartFields(),
  ValidateShoppingCart.validateShoppingCart,
  ShoppingCartController.updateCart);

shoppingRoute.post('/shoppingcart/add',
  Validator.validateAddToCartFields(),
  ValidateShoppingCart.validateShoppingCart,
  Validator.validateId('product_id'),
  ValidateProduct.validateProduct,
  ShoppingCartController.addToCart);

export default shoppingRoute;
