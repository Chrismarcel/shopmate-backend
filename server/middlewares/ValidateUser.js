import { check, validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import ResponseHandler from '../helpers/ResponseHandler';

/**
 * @class ValidateUser
 * @description Validates user registration details
 * @exports ValidateUser
 */
class ValidateUser {
  /**
   * @method checkUserDetails
   * @description Validates registration details using express validator
   * @returns {array} - Array of validation methods
   */
  static checkUserDetails() {
    return [
      check('name')
        .exists()
        .withMessage('required')
        .isLength({ min: 2 })
        .withMessage('The length is too short name.')
        .isLength({ max: 100 })
        .withMessage('The length is too long name.')
        .exists()
        .withMessage('required'),

      check('email')
        .exists()
        .withMessage('required')
        .isLength({ min: 0, max: 50 })
        .withMessage('The length is too long email')
        .isEmail()
        .withMessage('The email is invalid.'),

      check('password')
        .exists()
        .withMessage('required')
    ];
  }

  /**
   * @method registerUser
   * @description Validates registration details provided by user
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async registerUser(req, res, next) {
    const { email, name, password } = req.body;
    const fields = validationResult(req).mapped();

    // Cater for required fields errors, i.e if required field was omitted
    const requiredFieldsErrors = FieldValidation.validateRequiredFields(fields);

    // Cater for other generic responses e.g invalid email, max length of characters etc
    const genericFieldErrors = FieldValidation.validateField(fields);

    if (requiredFieldsErrors.length > 0) {
      return ResponseHandler.badRequest({
        code: 'USR_02',
        message: 'The field(s) is/are required.',
        field: `${requiredFieldsErrors.join(', ')}`
      },
      res);
    }

    if (genericFieldErrors.length > 0) {
      const errorField = genericFieldErrors;
      return ResponseHandler.badRequest({
        code: 'USR_03',
        message: fields[errorField].msg,
        field: errorField
      },
      res);
    }

    // Check if user email is unique
    try {
      if (await ValidateUser.emailIsUnique(email, res)) {
        req.name = name.trim();
        req.email = email.trim();
        req.password = password;
        return next();
      }
      return ResponseHandler.badRequest({
        code: 'USR_04',
        message: 'The email already exists',
        field: 'email'
      },
      res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method emailIsUnique
   * @description Validates if user email is unique
   * @param {string} email - User's email
   * @returns {boolean} - If user email is unique or not
   */
  static async emailIsUnique(email) {
    try {
      const emailQuery = await dbQuery('CALL customer_get_login_info(?)', email);
      return emailQuery[0].length === 0;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default ValidateUser;
