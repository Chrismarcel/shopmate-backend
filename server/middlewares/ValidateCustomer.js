import { check, validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { HelperUtils, ResponseHandler } from '../helpers';

/**
 * @class ValidateUser
 * @description Validates user registration details
 * @exports ValidateUser
 */
class ValidateUser {
  /**
   * @method validateRegistrationFields
   * @description Validates registration details using express validator
   * @returns {array} - Array of validation methods
   */
  static validateRegistrationFields() {
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

      ...ValidateUser.validateLoginFields()
    ];
  }

  /**
   * @method validateLoginFields
   * @description Validates login fields using express validator
   * @returns {array} - Array of validation methods
   */
  static validateLoginFields() {
    return [
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
   * @method validateAccountDetails
   * @description Validates Customer Account details
   * @returns {array} - Array of validation methods
   */
  static validateAccountDetails() {
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

      check('day_phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('This is an invalid phone number'),

      check('eve_phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('This is an invalid phone number'),

      check('mob_phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('This is an invalid phone number')
    ];
  }

  /**
   * @method registrationDetails
   * @description Validates registration details provided by user
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async registrationDetails(req, res, next) {
    const { email, name, password } = req.body;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateUser.validateUserFields(fields);
    if (errorObj && Object.keys(errorObj).length > 0) {
      return ResponseHandler.badRequest(errorObj, res);
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
   * @method loginDetails
   * @description Validates login details provided by user
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async loginDetails(req, res, next) {
    const { email, password } = req.body;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateUser.validateUserFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    try {
      const customerDetails = await dbQuery('CALL customer_get_login_info(?)', email);
      if (customerDetails[0].length > 0) {
        const hashedPassword = customerDetails[0][0].password;
        const passwordIsCorrect = HelperUtils.verifyPassword(password, hashedPassword);
        if (passwordIsCorrect) {
          req.userId = customerDetails[0][0].customer_id;
          return next();
        }
        return ResponseHandler.badRequest({
          code: 'USR_01',
          message: 'Email or Password is invalid',
          field: 'email, password'
        },
        res);
      }
      return ResponseHandler.badRequest({
        code: 'USR_05',
        message: "The email doesn't exist.",
        field: 'email'
      },
      res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method profileUpdateDetails
   * @description Validates profile details provided by user during update
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async profileUpdateDetails(req, res, next) {
    const { body, customerData } = req;
    const {
      customer_id: customerId,
      name,
      email,
      password,
      day_phone: dayPhone,
      eve_phone: evePhone,
      mob_phone: mobPhone
    } = customerData;

    const customerProfileData = {
      customer_id: customerId,
      name,
      email,
      password,
      day_phone: dayPhone,
      eve_phone: evePhone,
      mob_phone: mobPhone
    };
    if (body.password) {
      const hashedPassword = HelperUtils.hashPassword(body.password);
      Object.assign(body, { password: hashedPassword });
    }
    const updatedCustomerDetails = Object.assign(customerProfileData, body);
    const fields = validationResult(req).mapped();
    const errorObj = ValidateUser.validateUserFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }
    req.customerDetails = updatedCustomerDetails;
    return next();
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

  /**
   * @method validateUserFields
   * @description Validates if user email is unique
   * @param {string} fields - Error fields
   * @returns {boolean} - If user email is unique or not
   */
  static validateUserFields(fields) {
    // Cater for required fields errors, i.e if required field was omitted
    const requiredFieldsErrors = FieldValidation.validateRequiredFields(fields);

    // Cater for other generic responses e.g invalid email, max length of characters etc
    const genericFieldErrors = FieldValidation.validateField(fields);

    if (requiredFieldsErrors.length > 0) {
      return {
        code: 'USR_02',
        message: 'The field(s) is/are required.',
        field: `${requiredFieldsErrors.join(', ')}`
      };
    }

    if (genericFieldErrors.length > 0) {
      const errorField = genericFieldErrors;
      let code = 'USR_03';
      if (fields[errorField].msg.includes('long') || fields[errorField].msg.includes('short')) {
        code = 'USR_07';
      }
      return {
        code,
        message: fields[errorField].msg,
        field: errorField
      };
    }
    return [];
  }
}

export default ValidateUser;
