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
    const { query } = req;
    const { order = 'category_id,ASC', limit = 0, page = 1 } = query;
    const totalLimit = Number(limit) || 20;
    const sortOptions = order.split(',');
    const sortField = sortOptions[0];
    const sortDirection = sortOptions[1];

    try {
      const getCountQuery = await dbQuery('SELECT COUNT(*) AS count FROM category');
      const { count } = getCountQuery[0];
      const getCategoriesQuery = 'SELECT * FROM category ORDER BY ? ? LIMIT ? OFFSET ?';
      const offset = (page - 1) * totalLimit;
      const rows = await dbQuery(getCategoriesQuery, [
        sortField,
        sortDirection,
        totalLimit,
        offset
      ]);

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

    try {
      const categoryQuery = await dbQuery('SELECT department_id FROM category WHERE category_id = ?',
        categoryId);
      const departmentId = categoryQuery[0].department_id;

      return ResponseHandler.success({ ...categoryDetails, department_id: departmentId }, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getCategoryProducts
   * @description Method to get categories of a product
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getCategoryProducts(req, res) {
    const { productDetails } = req;
    const { product_id: productId } = productDetails;
    try {
      const categoriesQuery = await dbQuery('CALL catalog_get_category_products(?)', productId);
      const categories = categoriesQuery[0];
      return ResponseHandler.success(categories, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getCategoriesWithDepartmentId
   * @description Method to get categories in a department
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getCategoriesWithDepartmentId(req, res) {
    const { department_id: departmentId } = req.params;
    try {
      const categoriesQuery = await dbQuery('CALL catalog_get_department_categories(?)',
        departmentId);
      const categories = categoriesQuery[0];
      return ResponseHandler.success(categories, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }
}

export default CategoryController;
