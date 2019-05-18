import { body } from 'express-validator/check';

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
      body('name')
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
      body('email')
        .exists()
        .withMessage('required')
        .isLength({ min: 0, max: 50 })
        .withMessage('The length is too long email')
        .isEmail()
        .withMessage('The email is invalid.'),

      body('password')
        .exists()
        .withMessage('required')
    ];
  }

  /**
   * @method validateProfileDetails
   * @description Validates Customer Profile details
   * @returns {array} - Array of validation methods
   */
  static validateProfileDetails() {
    return [
      body('name')
        .exists()
        .withMessage('required')
        .isLength({ min: 2 })
        .withMessage('The length is too short name.')
        .isLength({ max: 100 })
        .withMessage('The length is too long name.')
        .exists()
        .withMessage('required'),

      body('email')
        .exists()
        .withMessage('required')
        .isLength({ min: 0, max: 50 })
        .withMessage('The length is too long email')
        .isEmail()
        .withMessage('The email is invalid.'),

      body('day_phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('This is an invalid phone number'),

      body('eve_phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('This is an invalid phone number'),

      body('mob_phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('This is an invalid phone number')
    ];
  }

  /**
   * @method validateAddressFields
   * @description Validates address fields using express validator
   * @returns {array} - Array of validation methods
   */
  static validateAddressFields() {
    return [
      body('address_1')
        .exists()
        .withMessage('required'),

      body('address_2').optional(),

      body('city')
        .exists()
        .withMessage('required'),

      body('region')
        .exists()
        .withMessage('required'),

      body('country')
        .exists()
        .withMessage('required'),

      body('postal_code')
        .exists()
        .withMessage('required'),

      body('shipping_region_id')
        .exists()
        .withMessage('required')
        .isNumeric()
        .withMessage('The Shipping Region ID is not number')
    ];
  }

  /**
   * @method validateCreditCardField
   * @description Validates credit card field using express validator
   * @returns {array} - Array of validation methods
   */
  static validateCreditCardField() {
    return [
      body('credit_card')
        .exists()
        .withMessage('required')
        .isCreditCard()
        .withMessage('This is an invalid Credit Card.')
    ];
  }
}

export default ValidateUser;
