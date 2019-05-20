import { validationResult } from 'express-validator/check';
import FieldValidation from './FieldValidation';
import { ResponseHandler } from '../helpers';

/**
 * @class ValidatePayment
 * @description Validates Payment details
 * @exports ValidatePayment
 */
class ValidatePayment {
  /**
   * @method validateTaxId
   * @description Validates the tax endpoint
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static validatePaymentDetails(req, res, next) {
    const fields = validationResult(req).mapped();
    const errorObj = ValidatePayment.validatePaymentFields(fields);

    if (Object.keys(errorObj).length) {
      return ResponseHandler.badRequest(errorObj, res);
    }

    // To test, use stripeToken = process.env.STRIPE_TOKEN
    // Visit https://stripe.com/docs/testing#cards to get Stripe Tokens
    const { amount, stripeToken, description, currency = 'USD' } = req.body;

    const amountToCharge = ValidatePayment.calculateAmount(amount, currency);
    req.paymentDetails = Object.assign({
      amount: amountToCharge,
      description,
      currency,
      source: stripeToken
    });
    return next();
  }

  /**
   * @method validatePaymentFields
   * @description Validates fields specified for the tax endpoint
   * @param {string} fields - Fields specified in either request param
   * @returns {array | object} - Error object
   */
  static validatePaymentFields(fields) {
    const requiredFieldsErrors = FieldValidation.validateRequiredFields(fields, 'STR_01');
    const genericErrors = FieldValidation.validateField(fields, 'STR_02');

    if (requiredFieldsErrors || genericErrors) {
      const errorObj = requiredFieldsErrors || genericErrors;
      return errorObj;
    }

    return [];
  }

  /**
   * @method calculateAmount
   * @description calculates amount to charge
   * @param {number} amount - Amount to charge
   * @param {string} currency - Currency
   * @returns {array | object} - Error object
   */
  static calculateAmount(amount, currency) {
    const nonZeroDecimalCurrencies = [
      'MGA',
      'BIF',
      'CLP',
      'PYG',
      'DJF',
      'RWF',
      'GNF',
      'UGX',
      'JPY',
      'VND',
      'VUV',
      'XAF',
      'KMF',
      'XOF',
      'KRW',
      'XPF'
    ];

    if (nonZeroDecimalCurrencies.includes(currency)) {
      return amount;
    }
    return amount / 100;
  }
}

export default ValidatePayment;
