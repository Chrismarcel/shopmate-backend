import { validationResult } from 'express-validator/check';
import dbQuery from '../database/dbconnection';
import FieldValidation from './FieldValidation';
import { HelperUtils, ResponseHandler } from '../helpers';

/**
 * @class ValidateCustomer
 * @description Validates Customer registration details
 * @exports ValidateCustomer
 */
class ValidateCustomer {
  /**
   * @method registrationDetails
   * @description Validates registration details provided by customer
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async registrationDetails(req, res, next) {
    const { email, name, password } = req.body;
    const fields = validationResult(req).mapped();
    const errorObj = ValidateCustomer.validateUserFields(fields);

    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    // Check if user email is unique
    try {
      if (await ValidateCustomer.emailIsUnique(email, res)) {
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
    const errorObj = ValidateCustomer.validateUserFields(fields);
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
   * @method updateProfileDetails
   * @description Validates profile details provided by user during update
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async updateProfileDetails(req, res, next) {
    const fields = validationResult(req).mapped();
    const errorObj = ValidateCustomer.validateUserFields(fields);
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

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
    req.customerDetails = updatedCustomerDetails;
    return next();
  }

  /**
   * @method updateAddressDetails
   * @description Validates address details provided by user during update
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async updateAddressDetails(req, res, next) {
    const fields = validationResult(req).mapped();
    const errorObj = ValidateCustomer.validateUserFields(fields, 'USR-09');
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    const { body, customerData } = req;
    const {
      customer_id: customerId,
      address_1: address1,
      address_2: address2,
      city,
      region,
      country,
      postal_code: postalCode,
      shipping_region_id: shippingRegionId
    } = customerData;

    const customerAddressData = {
      customer_id: customerId,
      address_1: address1,
      address_2: address2,
      city,
      region,
      postal_code: postalCode,
      country,
      shipping_region_id: shippingRegionId
    };

    const updatedCustomerDetails = Object.assign(customerAddressData, body);
    req.customerDetails = updatedCustomerDetails;
    return next();
  }

  /**
   * @method updateCreditCardDetails
   * @description Validates credit card details provided by user during update
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async updateCreditCardDetails(req, res, next) {
    const fields = validationResult(req).mapped();
    const errorObj = ValidateCustomer.validateUserFields(fields, 'USR_08');
    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    const { body, customerData } = req;
    const { customer_id: customerId } = customerData;
    req.customerDetails = { customerId, creditCard: body.credit_card };
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
   * @description Validates fields specified by customer
   * @param {string} fields - Fields specified in either request parama
   * @returns {boolean} - If user email is unique or not
   */
  static validateUserFields(fields) {
    // Cater for required fields errors, i.e if required field was omitted
    const requiredFieldsErrors = FieldValidation.validateRequiredFields(fields, 'USR_02');

    // Cater for other generic responses e.g invalid email, max length of characters etc
    const genericErrors = FieldValidation.validateField(fields, 'USR_03');

    if (requiredFieldsErrors || genericErrors) {
      const errorObj = requiredFieldsErrors || genericErrors;
      if (errorObj.message.includes('long') || errorObj.message.includes('short')) {
        errorObj.code = 'USR_07';
      }
      return errorObj;
    }

    return [];
  }
}

export default ValidateCustomer;
