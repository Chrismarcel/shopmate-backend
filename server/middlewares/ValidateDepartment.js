import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { ResponseHandler } from '../helpers';

/**
 * @class ValidateDepartmnet
 * @description Validates department details
 * @exports ValidateUser
 */
class ValidateDepartment {
  /**
   * @method validateDepartmentId
   * @description Validates the department endpoint
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async validateDepartmentId(req, res, next) {
    const { department_id: departmentId } = req.params;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateDepartment.validateDepartmentFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    const departmentExists = await ValidateDepartment.departmentExists(departmentId);
    if (departmentExists) {
      req.departmentDetails = { department_id: departmentId, ...departmentExists[0] };
      return next();
    }
    const error = {
      code: 'DEP_02',
      message: "Don't exist department with this ID.",
      field: 'department_id'
    };
    return ResponseHandler.badRequest(error, res);
  }

  /**
   * @method validateDepartmentFields
   * @description Validates fields specified for the department endpoint
   * @param {string} fields - Fields specified in either request parama
   * @returns {boolean} - If user email is unique or not
   */
  static validateDepartmentFields(fields) {
    // Cater for required fields errors, i.e if required field was omitted
    const requiredFieldsErrors = FieldValidation.validateRequiredFields(fields, 'DEP_03');

    // Cater for other generic responses e.g invalid email, max length of characters etc
    const genericErrors = FieldValidation.validateField(fields, 'DEP_01');

    if (requiredFieldsErrors || genericErrors) {
      const errorObj = requiredFieldsErrors || genericErrors;
      return errorObj;
    }

    return [];
  }

  /**
   * @method departmentExists
   * @description Validates if a specific department exists
   * @param {string} departmentId - Fields specified in either request parama
   * @returns {boolean} - If user email is unique or not
   */
  static async departmentExists(departmentId) {
    const departmentDetails = await dbQuery('CALL catalog_get_department_details(?)', departmentId);
    if (departmentDetails[0].length) {
      return departmentDetails[0];
    }
    return false;
  }
}

export default ValidateDepartment;
