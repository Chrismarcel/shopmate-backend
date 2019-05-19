import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import { ResponseHandler, HelperUtils } from '../helpers';

dotenv.config();

/**
 * @class ShoppingCartController
 * @description Handles Shopping Cart oriented actions
 * @exports ShoppingCartController
 */
class ShoppingCartController {
  /**
   * @method getAllShoppingCart
   * @description Method to get all taxes from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getAllShoppingCart(req, res) {
    try {
      const shoppingCartDetails = await dbQuery('SELECT * FROM tax');
      const taxData = shoppingCartDetails;

      return ResponseHandler.success(taxData, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
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
