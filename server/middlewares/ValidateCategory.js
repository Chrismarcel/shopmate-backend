import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { ResponseHandler } from '../helpers';

/**
 * @class ValidateCategory
 * @description Validates Category details
 * @exports ValidateCategory
 */
class ValidateCategory {
  /**
   * @method ValidateCategoryId
   * @description Validates the category endpoint
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async validateCategoryId(req, res, next) {
    const { category_id: categoryId } = req.params;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateCategory.validateCategoryFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    const categoryExists = await ValidateCategory.categoryExists(categoryId);
    if (categoryExists) {
      req.categoryDetails = { category_id: categoryId, ...categoryExists[0] };
      return next();
    }
    const error = {
      code: 'CAT_01',
      message: "Don't exist category with this ID.",
      field: 'category_id'
    };
    return ResponseHandler.badRequest(error, res);
  }

  /**
   * @method validatePagination
   * @description Validates fields specified for the category pagination e.g sort, limit, page
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - Response error object
   */
  static validatePagination(req, res, next) {
    const fields = validationResult(req).mapped();
    const errorObj = ValidateCategory.validateCategoryFields(fields);
    delete errorObj.field;
    if (Object.keys(errorObj).length) {
      errorObj.code = 'PAG_01';
      if (errorObj.message.includes('sorting')) {
        errorObj.code = 'PAG_02';
      }
      return ResponseHandler.badRequest(errorObj, res);
    }
    return next();
  }

  /**
   * @method validateCategoryFields
   * @description Validates fields specified for the category endpoint
   * @param {string} fields - Fields specified in either request param
   * @returns {array | object} - Error object
   */
  static validateCategoryFields(fields) {
    const genericErrors = FieldValidation.validateField(fields, 'CAT_02');
    if (genericErrors) {
      return genericErrors;
    }

    return [];
  }

  /**
   * @method categoryExists
   * @description Validates if a specific category exists
   * @param {string} categoryId - Fields specified in request param
   * @returns {boolean} - If category exists or not
   */
  static async categoryExists(categoryId) {
    const categoryDetails = await dbQuery('CALL catalog_get_category_details(?)', categoryId);
    if (categoryDetails[0].length) {
      return categoryDetails[0];
    }
    return false;
  }
}

export default ValidateCategory;
