import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { ResponseHandler } from '../helpers';

/**
 * @class ValidateAttribute
 * @description Validates Attribute details
 * @exports ValidateAttribute
 */
class ValidateAttribute {
  /**
   * @method validateAttributeId
   * @description Validates the attribute endpoint
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async validateAttributeId(req, res, next) {
    const { attribute_id: attributeId } = req.params;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateAttribute.validateAttributeFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    const attributeExists = await ValidateAttribute.attributeExists(attributeId);
    if (attributeExists) {
      req.attributeDetails = attributeExists;
      return next();
    }
    const error = {
      code: 'ATT_02',
      message: "Don't exist attribute with this ID.",
      field: 'attribute_id'
    };
    return ResponseHandler.badRequest(error, res);
  }

  /**
   * @method validateAttributeFields
   * @description Validates fields specified for the attribute endpoint
   * @param {string} fields - Fields specified in either request param
   * @returns {array | object} - Error object
   */
  static validateAttributeFields(fields) {
    const genericErrors = FieldValidation.validateField(fields, 'ATT_01');

    if (genericErrors) {
      return genericErrors;
    }

    return [];
  }

  /**
   * @method attributeExists
   * @description Validates if a specific attribute exists
   * @param {string} attributeId - Fields specified in request param
   * @returns {boolean} - If tax exists or not
   */
  static async attributeExists(attributeId) {
    const attributeDetails = await dbQuery('SELECT * FROM attribute WHERE attribute_id = ?',
      attributeId);
    if (attributeDetails.length) {
      return attributeDetails[0];
    }
    return false;
  }
}

export default ValidateAttribute;
