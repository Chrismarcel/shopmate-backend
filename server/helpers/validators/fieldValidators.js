import { check } from 'express-validator/check';

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
    check(field)
      .optional({ checkFalsy: true, nullable: true })
      .isIn(sortList)
      .withMessage("The order is not matched 'field,(DESC|ASC).'")
      .custom(allowedField => allowedFieldsList.includes(allowedField.split(',')[0]))
      .withMessage('The field of order is not allow sorting.')
  ],

  validatePaginationParams: () => [
    check('page')
      .optional()
      .isNumeric()
      .withMessage('The page must be a number.'),

    check('limit')
      .optional()
      .isNumeric()
      .withMessage('The limit must be a number.'),

    check('description_length')
      .optional()
      .isNumeric()
      .withMessage('The description length must be a number.')
  ],

  validateSearchQuery: () => [
    check('query_string')
      .exists()
      .withMessage('required'),

    check('all_words')
      .optional()
      .isIn(['on', 'off'])
      .withMessage('Field is invalid, should be on|off ')
  ]
};

export default Validators;
