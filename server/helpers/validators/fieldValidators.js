import { check, body, query, param } from 'express-validator/check';
import currencyList from '../Currencies';

const Validators = {
  validateId: (field, required = true) => [
    check(field)
      .optional()
      .custom(fieldValue => required || !Number(fieldValue))
      .withMessage('required')
      .isNumeric()
      .withMessage('The ID is not a number.')
  ],

  validateSortParams: (field, sortList, allowedFieldsList) => [
    query(field)
      .optional({ checkFalsy: true, nullable: true })
      .isIn(sortList)
      .withMessage("The order is not matched 'field,(DESC|ASC).'")
      .custom(allowedField => allowedFieldsList.includes(allowedField.split(',')[0]))
      .withMessage('The field of order is not allow sorting.')
  ],

  validatePaginationParams: () => [
    query('page')
      .optional()
      .isNumeric()
      .withMessage('The page must be a number.'),

    query('limit')
      .optional()
      .isNumeric()
      .withMessage('The limit must be a number.'),

    query('description_length')
      .optional()
      .isNumeric()
      .withMessage('The description length must be a number.')
  ],

  validateSearchQuery: () => [
    query('query_string')
      .exists()
      .withMessage('required'),

    query('all_words')
      .optional()
      .isIn(['on', 'off'])
      .withMessage('Field is invalid, should be on|off ')
  ],

  validateReviewBody: () => [
    body('review')
      .exists()
      .withMessage('required'),

    body('rating')
      .exists()
      .withMessage('required')
      .isInt({ min: 1, max: 5 })
      .withMessage('Field is invalid, should be integer between 1 to 5')
  ],

  validateOrderId: () => [
    param('order_id')
      .exists()
      .withMessage('required')
      .isInt()
      .withMessage('Order Id should be a number.')
  ],

  validateAccessToken: () => [
    body('access_token')
      .exists()
      .withMessage('required')
  ],

  validateOrderFields: () => [
    body('cart_id')
      .exists()
      .withMessage('required'),

    body('shipping_id')
      .exists()
      .withMessage('required')
      .isInt({ min: 0 })
      .withMessage('Shipping ID should be a number'),

    body('tax_id')
      .exists()
      .withMessage('required')
      .isInt({ min: 0 })
      .withMessage('Tax ID should be a number')
  ],

  validateAddToCartFields: () => [
    body('cart_id')
      .exists()
      .withMessage('required'),

    body('product_id')
      .exists()
      .withMessage('required')
      .isInt({ min: 0 })
      .withMessage('Product ID should be a number'),

    body('attributes')
      .exists()
      .withMessage('required')
  ],

  validateCartId: () => [
    param('cart_id')
      .exists()
      .withMessage('required')
  ],

  validateItemId: () => [
    param('item_id')
      .exists()
      .withMessage('required')
      .isInt({ min: 0 })
      .withMessage('Item ID should be a number')
  ],

  validateUpdateCartFields: () => [
    param('item_id')
      .exists()
      .withMessage('required')
      .isInt({ min: 0 })
      .withMessage('Item ID should be a number'),

    body('quantity')
      .exists()
      .withMessage('required')
      .isInt({ min: 0 })
      .withMessage('Quantity should be a number')
  ],

  validatePayment: () => [
    body('stripeToken')
      .exists()
      .withMessage('required'),

    body('order_id')
      .exists()
      .withMessage('required')
      .isInt({ min: 1 })
      .withMessage('Order ID should be a number.'),

    body('description')
      .exists()
      .withMessage('required'),

    body('amount')
      .exists()
      .withMessage('required')
      .isFloat({ gt: 0 })
      .withMessage('Amount should be a number.'),

    body('currency')
      .optional()
      .isIn(currencyList)
      .withMessage('Currency is not supported by Stripe.')
  ]
};

export default Validators;
