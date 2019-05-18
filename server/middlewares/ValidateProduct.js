import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { ResponseHandler } from '../helpers';

/**
 * @class ValidateProduct
 * @description Validates Product details
 * @exports ValidateProduct
 */
class ValidateProduct {
  /**
   * @method validateProductId
   * @description Validates the product endpoint
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async validateProduct(req, res, next) {
    const { product_id: productId } = req.params;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateProduct.validateProductFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    if (!req.path.endsWith('search')) {
      const productExists = await ValidateProduct.productExists(productId);
      if (productExists) {
        req.productDetails = productExists;
        return next();
      }
      const error = {
        code: 'PRD_02',
        message: "Don't exist product with this ID.",
        field: 'product_id'
      };
      return ResponseHandler.badRequest(error, res);
    }
    return next();
  }

  /**
   * @method validateProductFields
   * @description Validates fields specified for the product endpoint
   * @param {string} fields - Fields specified in either request param
   * @returns {array | object} - Error object
   */
  static validateProductFields(fields) {
    const genericErrors = FieldValidation.validateField(fields, 'PRD_01');

    if (genericErrors) {
      if (genericErrors.message === 'empty') {
        genericErrors.message = `The field ${genericErrors.field} is empty`;
        genericErrors.code = 'PRD_03';
        genericErrors.field = genericErrors.field;
      }

      if (genericErrors.field === 'rating') {
        genericErrors.code = 'PRD_04';
        genericErrors.field = genericErrors.field;
      }
      return genericErrors;
    }

    return [];
  }

  /**
   * @method productExists
   * @description Validates if a specific product exists
   * @param {string} productId - Fields specified in request param
   * @returns {boolean} - If product exists or not
   */
  static async productExists(productId) {
    const productDetails = await dbQuery('SELECT * FROM product WHERE product_id = ?', productId);
    if (productDetails.length) {
      return productDetails[0];
    }
    return false;
  }
}

export default ValidateProduct;
