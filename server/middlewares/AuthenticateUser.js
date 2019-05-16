import dbQuery from '../database/dbconnection';
import { ResponseHandler, HelperUtils } from '../helpers';

/**
 * @class AuthenticateUser
 * @description Authenticates a given user
 * @exports AuthenticateUser
 */
class AuthenticateUser {
  /**
   * @method verifyAuthHeader
   * @description Verifies that the authorization was set
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} - JSON response object
   */
  static async verifyAuthHeader(req) {
    const { 'user-key': authorization } = req.headers;
    if (!authorization) {
      return { error: 'no_auth' };
    }

    const token = authorization.split(' ')[1];
    const payload = HelperUtils.verifyToken(token);
    try {
      const { userId } = payload;
      const customerDetails = await dbQuery('CALL customer_get_customer(?)', userId);
      if (customerDetails[0].length === 1) {
        const customerData = customerDetails[0][0];
        return customerData;
      }
      return { error: 'invalid_token' };
    } catch (error) {
      return { error: 'invalid_token' };
    }
  }

  /**
   * @method verifyUser
   * @description Verifies the token provided by the user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async verifyUser(req, res, next) {
    const payload = await AuthenticateUser.verifyAuthHeader(req);
    let errorMsg, errorCode, errorField;
    if (payload.error === 'no_auth') {
      errorMsg = 'Authorization code is empty.';
      errorCode = 'AUT_01';
      errorField = 'NoAuth';
    } else if (payload.error) {
      errorMsg = 'Access Unauthorized.';
      errorCode = 'AUT_02';
      errorField = 'InvalidToken';
    }

    if (payload.error) {
      return ResponseHandler.unauthorized({
        code: errorCode,
        message: errorMsg,
        field: errorField
      },
      res);
    }

    req.customerData = payload;
    return next();
  }
}

export default AuthenticateUser;
