import dotenv from 'dotenv';
import { get } from 'axios';
import dbQuery from '../database/dbconnection';
import { HelperUtils, ResponseHandler } from '../helpers';
import ValidateCustomer from '../middlewares/ValidateCustomer';

dotenv.config();

/**
 * @class CustomerController
 * @description Handles Customer oriented actions
 * @exports CustomerController
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
      const customerData = await CustomerController.fetchCustomer(email);
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
    const { email } = req;
    try {
      const customerData = await CustomerController.fetchCustomer(email);
      delete customerData.password;
      const { name, customer_id: userId } = customerData;
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
      const email = queryParams[2];

      const customerData = await CustomerController.fetchCustomer(email);

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
    const { customerDetails: customerAddressDetails, email } = req;
    const queryParams = Object.values(customerAddressDetails);
    try {
      await dbQuery('CALL customer_update_address(?, ?, ?, ?, ?, ?, ?, ?)', queryParams);

      const customerData = await CustomerController.fetchCustomer(email);

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
    const { customerDetails: customerCreditCardDetails, email } = req;
    const queryParams = Object.values(customerCreditCardDetails);
    try {
      await dbQuery('CALL customer_update_credit_card(?, ?)', queryParams);

      const customerData = await CustomerController.fetchCustomer(email);

      return ResponseHandler.success(customerData, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method socialLogin
   * @description Controller to handle social login
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async socialLogin(req, res) {
    const baseUrl = 'https://graph.facebook.com/v3.0/me?fields=name,email&access_token=';
    const { access_token: facebookAccessToken } = req.body;
    const userDetailsRequest = await get(`${baseUrl}${facebookAccessToken}`);
    const { email, name } = userDetailsRequest.data;

    const emailIsUnique = await ValidateCustomer.emailIsUnique(email);

    if (emailIsUnique) {
      try {
        await dbQuery('INSERT INTO customer(name, email) VALUES(?, ?)', [name, email]);
      } catch (error) {
        ResponseHandler.serverError(res);
      }
    }
    const customerData = await CustomerController.fetchCustomer(email);
    const { customer_id: userId } = customerData;
    const accessToken = HelperUtils.generateToken({ userId, name, email });
    ResponseHandler.success({ customer: customerData, accessToken, expires_in: '24h' }, res);
  }

  /**
   * @method getCustomerDetails
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
   * @param {object} email - The customer id
   * @returns {object} - Response object
   */
  static async fetchCustomer(email) {
    try {
      const customerDetails = await dbQuery('SELECT * FROM customer WHERE email = ?', email);
      const customerData = customerDetails[0];
      delete customerData.password;

      return customerData;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default CustomerController;
