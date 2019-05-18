import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import { ResponseHandler } from '../helpers';

dotenv.config();

/**
 * @class ShippingController
 * @description Handles Shipping oriented actions
 * @exports ShippingController
 */
class ShippingController {
  /**
   * @method getShippingRegions
   * @description Method to get all shipping regions from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getShippingRegions(req, res) {
    try {
      const taxDetails = await dbQuery('CALL customer_get_shipping_regions()');

      return ResponseHandler.success(taxDetails[0], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getShippingRegionWithId
   * @description Method to get a single tax from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static getShippingRegionWithId(req, res) {
    const { shippingRegionDetails } = req;
    return ResponseHandler.success(shippingRegionDetails, res);
  }
}

export default ShippingController;
