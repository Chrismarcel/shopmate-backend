import { check } from 'express-validator/check';

/**
 * @class ValidateDepartment
 * @description Validates user registration details
 * @exports ValidateUser
 */
class ValidateDepartment {
  /**
   * @method validateDepartmentId
   * @description Validates department id field using express validator
   * @returns {array} - Array of validation methods
   */
  static validateDepartmentId() {
    return [
      check('department_id')
        .exists()
        .withMessage('required')
        .isNumeric()
        .withMessage('The ID is not a number.')
    ];
  }
}

export default ValidateDepartment;
