import { body, query, param } from 'express-validator/check';

const Validators = {
  validateId: (field, required = true) => [
    param(field)
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
      .withMessage('empty'),

    body('rating')
      .exists()
      .withMessage('empty')
      .isInt({ min: 1, max: 5 })
      .withMessage('Field is invalid, should be integer between 1 to 5')
  ],

  validateOrderFields: () => [
    body('cart_id')
      .exists()
      .withMessage('empty'),

    body('shipping_id')
      .exists()
      .withMessage('empty')
      .isInt()
      .withMessage('Shipping ID should be a number'),

    body('tax_id')
      .exists()
      .withMessage('empty')
      .isInt()
      .withMessage('Tax ID should be a number')
  ]
};

export default Validators;
