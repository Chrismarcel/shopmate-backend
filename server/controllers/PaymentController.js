import dotenv from 'dotenv';
import stripeAuth from 'stripe';
import { ResponseHandler } from '../helpers';

dotenv.config();

/**
 * @class PaymentController
 * @description Handles Payment oriented actions
 * @exports PaymentController
 */
class PaymentController {
  /**
   * @method makePayment
   * @description Method to make payment with stripe
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - Response object
   */
  static async makePayment(req, res) {
    try {
      const stripe = stripeAuth(process.env.STRIPE_KEY);
      const payment = await stripe.charges.create(req.paymentDetails);
      return ResponseHandler.success(payment, res);
    } catch (error) {
      return res.status(error.statusCode).json({
        error: {
          status: error.statusCode,
          code: 'STR_03',
          message: error.message,
          field: error.rawType
        }
      });
    }
  }
}

export default PaymentController;
