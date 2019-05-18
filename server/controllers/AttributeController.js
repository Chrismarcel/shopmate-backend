import dotenv from 'dotenv';
import dbQuery from '../database/dbconnection';
import { ResponseHandler } from '../helpers';

dotenv.config();

/**
 * @class AttributeController
 * @description Handles Attribute oriented actions
 * @exports AttributeController
 */
class AttributeController {
  /**
   * @method getAllAttributes
   * @description Method to get all attributes from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getAllAttributes(req, res) {
    try {
      const attrubuteDetails = await dbQuery('CALL catalog_get_attributes()');
      const attributeData = attrubuteDetails;

      return ResponseHandler.success(attributeData[0], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getAttributeValues
   * @description Method to get all values of an attribute from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getAttributeValues(req, res) {
    const { attribute_id: attributeId } = req.attributeDetails;
    try {
      const attributeValues = await dbQuery('CALL catalog_get_attribute_values(?)', attributeId);
      return ResponseHandler.success(attributeValues[0], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getAttributesInProduct
   * @description Method to get all values of an attribute from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getAttributesInProduct(req, res) {
    const { productDetails } = req;
    const { product_id: productId } = productDetails;
    try {
      const getProducts = await dbQuery('CALL catalog_get_product_attributes(?)', productId);
      return ResponseHandler.success(getProducts[0], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getAttributeWithId
   * @description Method to get a single attribute from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static getAttributeWithId(req, res) {
    const { attributeDetails } = req;
    return ResponseHandler.success(attributeDetails, res);
  }
}

export default AttributeController;
