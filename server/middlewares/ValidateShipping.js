import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { ResponseHandler } from '../helpers';

/**
 * @class ValidateShipping
 * @description Validates Shipping details
 * @exports ValidateShipping
 */
class ValidateShipping {
  /**
   * @method validateShippingRegionId
   * @description Validates the shipping endpoint
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async validateShippingRegionId(req, res, next) {
    const { shipping_region_id: shippingId } = req.params;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateShipping.validateShippingFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    const shippingDetailExist = await ValidateShipping.shippingDetailExist(shippingId);
    req.shippingRegionDetails = shippingDetailExist;
    return next();
  }

  /**
   * @method validateShippingFields
   * @description Validates fields specified for the shipping endpoint
   * @param {string} fields - Fields specified in either request param
   * @returns {array | object} - Error object
   */
  static validateShippingFields(fields) {
    const genericErrors = FieldValidation.validateField(fields, 'SHP_01');

    if (genericErrors) {
      return genericErrors;
    }

    return [];
  }

  /**
   * @method shippingId
   * @description Validates if a specific shipping exists
   * @param {string} shippingId - Fields specified in request param
   * @returns {boolean} - If shipping exists or not
   */
  static async shippingDetailExist(shippingId) {
    const shippingDetails = await dbQuery(`
    SELECT *
    FROM shipping 
    WHERE shipping_region_id = ?`,
    shippingId);
    if (shippingDetails.length) {
      return shippingDetails;
    }
    return [];
  }
}

export default ValidateShipping;
