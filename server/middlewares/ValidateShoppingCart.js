import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { ResponseHandler } from '../helpers';

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
    const cartId = req.params.cart_id || req.body.cart_id;
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

    const shoppingCartExists = await ValidateShoppingCart.shoppingCartExists(cartId);

    if (req.method.toLowerCase() === 'get' && !shoppingCartExists) {
      const error = {
        code: 'CRT_02',
        message: "Don't exist cart with this ID.",
        field: 'cart_id'
      };
      return ResponseHandler.badRequest(error, res);
    }

    if (shoppingCartExists) {
      req.shoppingCartDetails = shoppingCartExists;
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
    const genericErrors = FieldValidation.validateField(fields, 'CRT_01');
    if (genericErrors) {
      if (genericErrors.message === 'empty') {
        genericErrors.message = `The field ${genericErrors.field} is empty.`;
      }
      return genericErrors;
    }

    return [];
  }

  /**
   * @method shoppingCartExists
   * @description Validates if a specific shopping cart exists
   * @param {string} cartId - Fields specified in request param
   * @returns {boolean} - If shoppingCart exists or not
   */
  static async shoppingCartExists(cartId) {
    const shoppingCartDetails = await dbQuery('CALL shopping_cart_get_products(?)', cartId);
    if (shoppingCartDetails.length) {
      return shoppingCartDetails[0];
    }

    return false;
  }
}

export default ValidateShoppingCart;
