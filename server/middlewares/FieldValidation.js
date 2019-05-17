/**
 * @class FieldValidation
 * @description Validates and sanitizes fields specified in request body
 * @exports ValidateUser
 */
class FieldValidation {
  /**
   * @method validateRequiredFields
   * @description Checks if there are required fields that aren't specified by user
   * @param {object} fields - Fields to be validated
   * @param {object} errorCode - Error code
   * @returns {array} - Array of unspecified fields
   */
  static validateRequiredFields(fields, errorCode) {
    if (Object.keys(fields).length > 0) {
      const fieldList = Object.keys(fields);
      const errorFields = fieldList.filter(field => fields[field].msg.includes('required'));
      if (errorFields.length > 0) {
        return {
          code: errorCode,
          message: 'The field(s) is/are required.',
          field: `${errorFields.join(', ')}`
        };
      }
    }
    return false;
  }

  /**
   * @method validateField
   * @description Validates the individual fields specified in request body
   * @param {object} fields - Error object
   * @param {object} errorCode - Error code
   * @returns {array} - Array of unspecified fields
   */
  static validateField(fields, errorCode) {
    if (Object.keys(fields).length > 0) {
      const errorField = Object.keys(fields)[0];
      const errorMessage = fields[errorField].msg;

      return {
        code: errorCode,
        message: errorMessage,
        field: errorField
      };
    }
    return false;
  }
}

export default FieldValidation;
