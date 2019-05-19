import { sign, verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

/**
 * @class HelperUtils
 * @description Specifies reusable helper methods
 * @exports HelperUtils
 */
class HelperUtils {
  /**
   * @method generateToken
   * @description Generate a token from a given payload
   * @param {object} payload The user payload to tokenize
   * @returns {string} JSON Web Token
   */
  static generateToken(payload) {
    return sign(payload, privateKey, { expiresIn: '24h' });
  }

  /**
   * @method verifyToken
   * @description Verifies a token and returns its subsequent payload
   * @param {string} token The token to decode
   * @returns {object} The resulting payload
   */
  static verifyToken(token) {
    try {
      const payload = verify(token, privateKey);
      return payload;
    } catch (error) {
      return false;
    }
  }

  /**
   * @method hashPassword
   * @description Hashes a users password
   * @param {string} password The users password
   * @returns {string} The resulting hashed password
   */
  static hashPassword(password) {
    const hashedPassword = crypto
      .pbkdf2Sync(`${password}`, privateKey, 10000, 20, 'SHA512')
      .toString('hex');

    return hashedPassword;
  }

  /**
   * @method verifyPassword
   * @description Validate a users password
   * @param {string} password The users password
   * @param {string} hashedPassword The hashedPassword
   * @returns {boolean} If password matched or not
   */
  static verifyPassword(password, hashedPassword) {
    return HelperUtils.hashPassword(password) === hashedPassword;
  }

  /**
   * @method generateUniqueId
   * @description generates a unique id
   * @returns {string} The unique id
   */
  static generateUniqueId() {
    return crypto.randomBytes(16).toString('hex');
  }
}

export default HelperUtils;
