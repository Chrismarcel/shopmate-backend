import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import { HelperUtils, ResponseHandler } from '../helpers';

dotenv.config();

/**
 * @class UserController
 * @description Handles User oriented actions
 * @exports ValidateUser
 */
class CustomerController {
  /**
   * @method registerCustomer
   * @description Registers a new user
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async registerCustomer(req, res) {
    const { name, email, password } = req;
    const hashedPassword = HelperUtils.hashPassword(password);
    try {
      const registerCustomerQuery = await dbQuery('CALL customer_add(?, ?, ?)', [
        name,
        email,
        hashedPassword
      ]);
      const userId = registerCustomerQuery[0][0]['LAST_INSERT_ID()'];
      const customerDetails = await dbQuery('CALL customer_get_customer(?)', userId);
      const customerData = customerDetails[0][0];
      delete customerData.password;
      const accessToken = `Bearer ${HelperUtils.generateToken({ userId, email, name })}`;
      ResponseHandler.success({
        customer: customerData,
        accessToken,
        expires_in: '24h'
      },
      res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method loginCustomer
   * @description Controller to handle user login
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async loginCustomer(req, res) {
    const { userId } = req;
    try {
      const customerDetails = await dbQuery('CALL customer_get_customer(?)', userId);
      const customerData = customerDetails[0][0];
      delete customerData.password;
      const { name, email } = customerData;
      const accessToken = `Bearer ${HelperUtils.generateToken({
        email,
        userId,
        name
      })}`;
      ResponseHandler.success({
        customer: customerData,
        accessToken,
        expires_in: '24h'
      },
      res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method updateCustomerDetails
   * @description Controller to update Customer profile details
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async updateCustomerProfileDetails(req, res) {
    const { customerDetails: customerProfileDetails } = req;
    const queryParams = Object.values(customerProfileDetails);
    try {
      await dbQuery('CALL customer_update_account(?, ?, ?, ?, ?, ?, ?)', queryParams);
      const customerId = queryParams[0];

      const customerData = await CustomerController.fetchCustomer(customerId);

      return ResponseHandler.success(customerData, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method updateCustomerAddressDetails
   * @description Controller to update Customer address details
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async updateCustomerAddressDetails(req, res) {
    const { customerDetails: customerAddressDetails } = req;
    const queryParams = Object.values(customerAddressDetails);
    try {
      await dbQuery('CALL customer_update_address(?, ?, ?, ?, ?, ?, ?, ?)', queryParams);
      const customerId = queryParams[0];

      const customerData = await CustomerController.fetchCustomer(customerId);

      return ResponseHandler.success(customerData, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method updateCustomerCreditCardDetails
   * @description Controller to update Customer credit card details
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async updateCustomerCreditCardDetails(req, res) {
    const { customerDetails: customerCreditCardDetails } = req;
    const queryParams = Object.values(customerCreditCardDetails);
    try {
      await dbQuery('CALL customer_update_credit_card(?, ?)', queryParams);
      const customerId = queryParams[0];

      const customerData = await CustomerController.fetchCustomer(customerId);

      return ResponseHandler.success(customerData, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method login
   * @description Controller to get customer details
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getCustomerDetails(req, res) {
    const { customerData } = req;
    try {
      delete customerData.password;
      return ResponseHandler.success(customerData, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method fetchCustomer
   * @description Method to get customer details from the database
   * @param {object} customerId - The customer id
   * @returns {object} - Response object
   */
  static async fetchCustomer(customerId) {
    const customerDetails = await dbQuery('CALL customer_get_customer(?)', customerId);
    const customerData = customerDetails[0][0];
    delete customerData.password;

    return customerData;
  }
}

export default CustomerController;
