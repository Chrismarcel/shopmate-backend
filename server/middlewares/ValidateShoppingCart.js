import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { ResponseHandler, CustomQueries } from '../helpers';

/**
 * @class ValidateShoppingCart
 * @description Validates Shopping Cart details
 * @exports ValidateShoppingCart
 */
class ValidateShoppingCart {
  /**
   * @method validateShoppingCartId
   * @description Validates the shoppingCart endpoint
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async validateShoppingCart(req, res, next) {
    const columnId = req.params.cart_id || req.body.cart_id || req.params.item_id;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateShoppingCart.validateShoppingCartFields(fields);

    // Call the next validation method
    // Called when validating product id from shopping cart endpoint
    if (errorObj.field === 'product_id') {
      return next();
    }

    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    const handleQueryResults = ValidateShoppingCart.handleQueryResults(req);

    if (handleQueryResults) {
      const queryResult = await handleQueryResults(columnId);
      // If no cart found, hence error code exists
      if (queryResult[0].code) {
        const error = queryResult[0];
        return ResponseHandler.badRequest(error, res);
      }
      req.shoppingCartDetails = queryResult;
    }
    return next();
  }

  /**
   * @method validateShoppingCartFields
   * @description Validates fields specified for the shoppingCart endpoint
   * @param {string} fields - Fields specified in either request param
   * @returns {array | object} - Error object
   */
  static validateShoppingCartFields(fields) {
    const requiredFieldsErrors = FieldValidation.validateRequiredFields(fields, 'CRT_01');
    const genericErrors = FieldValidation.validateField(fields, 'CRT_02');

    if (requiredFieldsErrors || genericErrors) {
      const errorObj = requiredFieldsErrors || genericErrors;
      return errorObj;
    }

    return [];
  }

  /**
   * @method handleQueryResults
   * @description handles the db query actions based on the http method
   * @param {object} req - Fields specified in either request param
   * @returns {array | object} - Error object
   */
  static handleQueryResults(req) {
    if (req.params.item_id) {
      return ValidateShoppingCart.cartItemExists;
    }

    if (req.method.toLowerCase() !== 'post') {
      return ValidateShoppingCart.shoppingCartExists;
    }

    return false;
  }

  /**
   * @method shoppingCartExists
   * @description Validates if a specific shopping cart exists
   * @param {string} cartId - Fields specified in request param
   * @returns {boolean} - If shopping cart exists or not
   */
  static async shoppingCartExists(cartId) {
    const shoppingCartDetails = await dbQuery(CustomQueries.getCartItemDetails, cartId);
    if (shoppingCartDetails.length) {
      return shoppingCartDetails;
    }

    return [
      {
        code: 'CRT_02',
        message: "Don't exist cart with this ID.",
        field: 'cart_id'
      }
    ];
  }

  /**
   * @method cartItemExists
   * @description Validates if a specific cart item exists
   * @param {string} itemId - Fields specified in request param
   * @returns {boolean} - If cart item exists or not
   */
  static async cartItemExists(itemId) {
    const query = 'SELECT product_id, cart_id, item_id FROM shopping_cart WHERE item_id = ?';
    const cartItemDetails = await ValidateShoppingCart.rowExists(query, itemId);
    if (cartItemDetails.length) {
      return cartItemDetails;
    }

    return [
      {
        code: 'CRT_03',
        message: "Don't exist item with this ID.",
        field: 'item_id'
      }
    ];
  }

  /**
   * @method rowExists
   * @description Validates if a specific cart item exists
   * @param {string} query - DB query to retrieve rows
   * @param {number} id - row id to search
   * @returns {array} - array of row objects
   */
  static async rowExists(query, id) {
    const row = await dbQuery(query, id);
    return row;
  }
}

export default ValidateShoppingCart;
