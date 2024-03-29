import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { ResponseHandler } from '../helpers';

/**
 * @class ValidateOrder
 * @description Validates Order details
 * @exports ValidateOrder
 */
class ValidateOrder {
  /**
   * @method validateOrderId
   * @description Validates the order endpoint
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async validateOrder(req, res, next) {
    const { order_id: orderId } = req.params || req.body;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateOrder.validateOrderFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    if (req.params.order_id) {
      const getOrderDetails = await dbQuery('CALL orders_get_order_details(?)', orderId);
      [req.orderDetails] = getOrderDetails;
    }
    return next();
  }

  /**
   * @method validateOrderFields
   * @description Validates fields specified for the order endpoint
   * @param {string} fields - Fields specified in either request param
   * @returns {array | object} - Error object
   */
  static validateOrderFields(fields) {
    const requiredFieldsErrors = FieldValidation.validateRequiredFields(fields, 'ORD_01');
    const genericErrors = FieldValidation.validateField(fields, 'ORD_02');

    if (requiredFieldsErrors || genericErrors) {
      const errorObj = requiredFieldsErrors || genericErrors;
      return errorObj;
    }

    return [];
  }
}

export default ValidateOrder;
