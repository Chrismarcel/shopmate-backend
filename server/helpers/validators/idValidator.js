import { check } from 'express-validator/check';

/**
 * @class ValidateID
 * @description Validates any required numeric id field
 * @exports ValidateID
 */
class IDValidator {
  /**
   * @method validateId
   * @description Validates every numeric id field using express validator
   * @returns {array} - Array of validation methods
   */
  static validateId() {
    return [
      check(['department_id', 'tax_id'])
        .optional()
        .withMessage('required')
        .isNumeric()
        .withMessage('The ID is not a number.')
    ];
  }
}

export default IDValidator;
