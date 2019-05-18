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
   * @description Method to get all products from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getAllProducts(req, res) {
    try {
      const { query } = req;
      const { limit = 0, page = 1, description_length: descriptionLength = 200 } = query;
      const totalLimit = Number(limit) || 20;
      const getProductsCount = await dbQuery('SELECT COUNT(*) AS count FROM product');
      const { count } = getProductsCount[0];

      const getProductsQuery = `
      SELECT *,
      IF (LENGTH(description) > ?, 
      CONCAT(SUBSTR(description, 1, ?), '...'),
      description) as description 
      FROM product LIMIT ? OFFSET ?`;

      const offset = (page - 1) * totalLimit;

      const productDetails = await dbQuery(getProductsQuery, [
        descriptionLength,
        descriptionLength,
        totalLimit,
        offset
      ]);
      const rows = productDetails;

      return ResponseHandler.success({ count, rows }, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method searchProducts
   * @description Method to get all products from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async searchProduct(req, res) {
    const { query } = req;
    try {
      const {
        query_string: queryString,
        limit = 0,
        page = 1,
        all_words: allWords = 'on',
        description_length: descriptionLength = 200
      } = query;

      const totalLimit = Number(limit) || 20;
      const getProductsCount = await dbQuery('CALL catalog_count_search_result(?, ?)', [
        queryString,
        allWords
      ]);
      const { 'count(*)': count } = getProductsCount;

      const offset = (page - 1) * totalLimit;

      const productDetails = await dbQuery('CALL catalog_search(?, ?, ?, ?, ?)', [
        queryString,
        allWords,
        descriptionLength,
        totalLimit,
        offset
      ]);
      const rows = productDetails[0];

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
