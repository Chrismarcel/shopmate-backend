import dotenv from 'dotenv';
import mailgun from 'mailgun-js';
import dbQuery from '../database/dbconnection';
import { ResponseHandler } from '../helpers';
import {
  emailHeader,
  bodyOpening,
  createEmailOrderTable,
  displayOrderTotal,
  bodyClosing
} from '../templates/email';

dotenv.config();

/**
 * @class OrderController
 * @description Handles Order oriented actions
 * @exports OrderController
 */
class OrderController {
  /**
   * @method getCustomerOrders
   * @description Method to get a customer's orders from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getCustomerOrders(req, res) {
    const { customer_id: customerId } = req.customerData;
    try {
      const getCustomerOrder = await dbQuery('CALL orders_get_by_customer_id(?)', customerId);
      return ResponseHandler.success(getCustomerOrder[0], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method getOrderWithId
   * @description Method to get a single order from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static getOrderWithId(req, res) {
    const { orderDetails } = req;
    return ResponseHandler.success(orderDetails, res);
  }

  /**
   * @method sendOrderEmail
   * @description Method to send order email notification to the user
   * @param {object} email - The user's email
   * @param {object} order - The order object
   * @returns {undefined}
   */
  static sendOrderEmail(email, order) {
    let totalAmount = 0;
    const apiKey = process.env.MAILGUN_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const mailgunInstance = mailgun({ apiKey, domain });
    const orderItems = order.map((orderItem) => {
      totalAmount += orderItem.subtotal;
      return createEmailOrderTable(orderItem);
    });
    const data = {
      from: `Shopmate ${process.env.MAILGUN_SENDER_EMAIL}`,
      to: email,
      subject: 'Shopmate Order',
      html: `
      ${emailHeader}
      ${bodyOpening}
      ${orderItems.join('')}
      ${displayOrderTotal(totalAmount)}
      ${bodyClosing}`
    };
    mailgunInstance.messages().send(data, (error, body) => error || body);
  }

  /**
   * @method getOrderShortDetails
   * @description Method to get details of an order from the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async getOrderShortDetails(req, res) {
    const { order_id: orderId } = req.orderDetails[0];
    try {
      const getOrderDetails = await dbQuery('CALL orders_get_order_short_details(?)', orderId);
      return ResponseHandler.success(getOrderDetails[0], res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }

  /**
   * @method postOrder
   * @description Method to post an order to the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async postOrder(req, res) {
    const { cart_id: cartId, shipping_id: shippingId, tax_id: taxId } = req.body;
    const { customer_id: customerId, email } = req.customerData;
    try {
      const createOrder = await dbQuery('CALL shopping_cart_create_order(?, ?, ?, ?)', [
        cartId,
        customerId,
        shippingId,
        taxId
      ]);
      const { orderId } = createOrder[0][0];
      const orderDetails = await dbQuery('CALL orders_get_order_details(?)', orderId);
      OrderController.sendOrderEmail(email, orderDetails[0]);
      return ResponseHandler.success({ order_id: orderId }, res);
    } catch (error) {
      return ResponseHandler.serverError(res);
    }
  }
}

export default OrderController;
