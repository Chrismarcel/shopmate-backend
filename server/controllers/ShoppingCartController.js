import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import { ResponseHandler, HelperUtils, CustomQueries } from '../helpers';

dotenv.config();

/**
 * @class ShoppingCartController
 * @description Handles Shopping Cart oriented actions
 * @exports ShoppingCartController
 */
class ShoppingCartController {
  /**
   * @method getItemsInCart
   * @description Method to get all items in cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getItemsInCart(req, res) {
    const { shoppingCartDetails: cartItems } = req;
    return ResponseHandler.success(cartItems, res);
  }

  /**
   * @method addToCart
   * @description Method to add item to cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async addToCart(req, res) {
    const { cart_id: cartId, attributes } = req.body;
    const { product_id: productId } = req.productDetails;

    try {
      await dbQuery('CALL shopping_cart_add_product(?, ?, ?)', [cartId, productId, attributes]);
      const shoppingCartDetails = await dbQuery('CALL shopping_cart_get_products(?)', cartId);

      return ResponseHandler.success(shoppingCartDetails[0], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method updateCart
   * @description Method to uodate an existing item in the cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async updateCart(req, res) {
    const { item_id: itemId, cart_id: cartId, product_id: productId } = req.shoppingCartDetails[0];
    const { quantity } = req.body;

    try {
      await dbQuery('CALL shopping_cart_update(?, ?)', [itemId, quantity]);
      const getItemDetails = await dbQuery(CustomQueries.getCartItemDetails, cartId);
      delete getItemDetails[0].image;
      getItemDetails[0].product_id = productId;
      return ResponseHandler.success(getItemDetails, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method emptyCart
   * @description Method to remove all items in cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async emptyCart(req, res) {
    const { cart_id: cartId } = req.params;
    try {
      await dbQuery('CALL shopping_cart_empty(?)', cartId);
      return ResponseHandler.success([], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method moveItemToCart
   * @description Method to move item to cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async moveItemToCart(req, res) {
    const { item_id: itemId } = req.params;
    try {
      await dbQuery('CALL shopping_cart_move_product_to_cart(?)', itemId);
      return ResponseHandler.success([], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getTotalAmount
   * @description - Get total amount of all items in a cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getTotalAmount(req, res) {
    const { cart_id: cartId } = req.params;
    try {
      const getTotalAmount = await dbQuery('CALL shopping_cart_get_total_amount(?)', cartId);
      return ResponseHandler.success(getTotalAmount[0][0], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method generateCartId
   * @description Method to generate a unique cart id
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static generateCartId(req, res) {
    return ResponseHandler.success({ cart_id: HelperUtils.generateUniqueId() }, res);
  }
}

export default ShoppingCartController;
