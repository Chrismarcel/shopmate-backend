import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import Utils from '../helpers/Utils';
import ResponseHandler from '../helpers/ResponseHandler';

dotenv.config();

/**
 * @class UserController
 * @description Handles User oriented actions
 * @exports ValidateUser
 */
class UserController {
  /**
   * @method register
   * @description Registers a new user
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async register(req, res) {
    const { name, email, password } = req;
    const hashedPassword = Utils.hashPassword(password);
    try {
      const registerCustomerQuery = await dbQuery('CALL customer_add(?, ?, ?)', [
        name,
        email,
        hashedPassword
      ]);
      const userId = registerCustomerQuery[0][0]['LAST_INSERT_ID()'];
      const customerDetails = await dbQuery('CALL customer_get_customer(?)', userId);
      delete customerDetails[0][0].password;
      const accessToken = `Bearer ${Utils.generateToken({ email, name })}`;
      ResponseHandler.success({
        schema: customerDetails[0][0],
        accessToken,
        expires_in: '24h'
      },
      res);
    } catch (error) {
      console.log(error);
      return ResponseHandler.serverError(res);
    }
  }
}

export default UserController;
