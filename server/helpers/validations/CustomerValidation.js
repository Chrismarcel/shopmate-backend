import { check } from 'express-validator/check';

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
}

export default ValidateUser;
