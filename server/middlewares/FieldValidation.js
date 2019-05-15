/**
 * @class FieldValidation
 * @description Validates and sanitizes fields specified in request body
 * @exports ValidateUser
 */
class FieldValidation {
  /**
   * @method validate
   * @description Checks if there are required fields that aren't specified by user
   * @param {object} fields - Fields to be validated
   * @returns {array} - Array of unspecified fields
   */
  static validateRequiredFields(fields) {
    if (Object.keys(fields).length > 0) {
      const fieldList = Object.keys(fields);
      const errorFields = fieldList.filter(field => fields[field].msg.includes('required'));
      return errorFields;
    }
    return [];
  }

  /**
   * @method validateField
   * @description Validates the individual fields specified in request body
   * @param {object} fields - Error object
   * @returns {array} - Array of unspecified fields
   */
  static validateField(fields) {
    if (Object.keys(fields).length > 0) {
      const errorField = Object.keys(fields)[0];
      return errorField;
    }
    return [];
  }
}

export default FieldValidation;
