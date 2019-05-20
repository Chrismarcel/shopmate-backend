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
    const productId = req.params.product_id || req.body.product_id;
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
        code: 'PRD_03',
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
    const requiredFieldsErrors = FieldValidation.validateRequiredFields(fields, 'PRD_01');
    const genericErrors = FieldValidation.validateField(fields, 'PRD_02');

    if (requiredFieldsErrors || genericErrors) {
      const errorObj = requiredFieldsErrors || genericErrors;
      return errorObj;
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
    const productDetails = await dbQuery('CALL catalog_get_product_info(?)', productId);
    if (productDetails[0].length) {
      return productDetails[0][0];
    }
    return false;
  }
}

export default ValidateProduct;
