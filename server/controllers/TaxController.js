import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import { ResponseHandler } from '../helpers';

dotenv.config();

/**
 * @class TaxController
 * @description Handles Tax oriented actions
 * @exports TaxController
 */
class TaxController {
  /**
   * @method getAllTaxes
   * @description Method to get all taxes from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getAllTaxes(req, res) {
    try {
      const taxDetails = await dbQuery('SELECT * FROM tax');
      const taxData = taxDetails;

      return ResponseHandler.success(taxData, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getTaxWithId
   * @description Method to get a single tax from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static getTaxWithId(req, res) {
    const { taxDetails } = req;
    return ResponseHandler.success(taxDetails, res);
  }
}

export default TaxController;
