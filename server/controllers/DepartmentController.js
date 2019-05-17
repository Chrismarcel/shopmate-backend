import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import { ResponseHandler } from '../helpers';

dotenv.config();

/**
 * @class DepartmentController
 * @description Handles User oriented actions
 * @exports ValidateUser
 */
class DepartmentController {
  /**
   * @method getAllDepartments
   * @description Method to get all departments from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getAllDepartments(req, res) {
    try {
      const departmentDetails = await dbQuery('CALL catalog_get_departments()');
      const departmentData = departmentDetails[0];

      return ResponseHandler.success(departmentData, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getAllDepartments
   * @description Method to get all departments from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static getDepartmentWithId(req, res) {
    const { departmentDetails } = req;
    return ResponseHandler.success(departmentDetails, res);
  }
}

export default DepartmentController;
