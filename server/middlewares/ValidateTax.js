import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { ResponseHandler } from '../helpers';

/**
 * @class ValidateTax
 * @description Validates Tax details
 * @exports ValidateTax
 */
class ValidateTax {
  /**
   * @method validateTaxId
   * @description Validates the tax endpoint
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async validateTaxId(req, res, next) {
    const { tax_id: taxId } = req.params;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateTax.validateTaxFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    const taxExists = await ValidateTax.taxExists(taxId);
    if (taxExists) {
      req.taxDetails = taxExists;
      return next();
    }
    const error = {
      code: 'TAX_02',
      message: "Don't exist tax with this ID.",
      field: 'tax_id'
    };
    return ResponseHandler.badRequest(error, res);
  }

  /**
   * @method validateTaxFields
   * @description Validates fields specified for the tax endpoint
   * @param {string} fields - Fields specified in either request param
   * @returns {array | object} - Error object
   */
  static validateTaxFields(fields) {
    const genericErrors = FieldValidation.validateField(fields, 'TAX_01');

    if (genericErrors) {
      return genericErrors;
    }

    return [];
  }

  /**
   * @method TaxExists
   * @description Validates if a specific tax exists
   * @param {string} taxId - Fields specified in request param
   * @returns {boolean} - If tax exists or not
   */
  static async taxExists(taxId) {
    const taxDetails = await dbQuery('SELECT * FROM tax WHERE tax_id = ?', taxId);
    if (taxDetails.length) {
      return taxDetails[0];
    }
    return false;
  }
}

export default ValidateTax;
