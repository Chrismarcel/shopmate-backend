import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import { ResponseHandler } from '../helpers';

dotenv.config();

/**
 * @class ProductController
 * @description Handles Product oriented actions
 * @exports ProductController
 */
class ProductController {
  /**
   * @method getAllProducts
   * @description Method to get all productes from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getAllProducts(req, res) {
    try {
      const getCountQuery = await dbQuery('SELECT COUNT(*) AS count FROM product');
      const { count } = getCountQuery[0];
      const productDetails = await dbQuery('SELECT * FROM product');
      const rows = productDetails;

      return ResponseHandler.success({ count, rows }, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getProductWithId
   * @description Method to get a single product from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static getProductWithId(req, res) {
    const { productDetails } = req;
    return ResponseHandler.success(productDetails, res);
  }
}

export default ProductController;
