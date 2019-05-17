import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import { ResponseHandler } from '../helpers';

dotenv.config();

/**
 * @class CategoryController
 * @description Handles Category oriented actions
 * @exports CategoryController
 */
class CategoryController {
  /**
   * @method getAllCategories
   * @description Method to get all categories from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getAllCategories(req, res) {
    try {
      const rows = await dbQuery('SELECT * FROM category');
      const count = rows.length;
      return ResponseHandler.success({ count, rows }, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getCategoryWithId
   * @description Method to get a single category from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getCategoryWithId(req, res) {
    const { categoryDetails } = req;
    const { category_id: categoryId } = categoryDetails;

    const categoryQuery = await dbQuery('SELECT department_id FROM category WHERE category_id = ?',
      categoryId);
    const departmentId = categoryQuery[0].department_id;

    return ResponseHandler.success({ ...categoryDetails, department_id: departmentId }, res);
  }
}

export default CategoryController;
