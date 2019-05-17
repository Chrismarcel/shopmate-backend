import { check } from 'express-validator/check';

const Validators = {
  validateId: field => [
    check(field)
      .optional()
      .isNumeric()
      .withMessage('The ID is not a number.')
  ],

  validateSortOrder: (field, sortList, allowedFieldsList) => [
    check(field)
      .optional({ checkFalsy: true, nullable: true })
      .isIn(sortList)
      .withMessage("The order is not matched 'field,(DESC|ASC).'")
      .custom(allowedField => allowedFieldsList.includes(allowedField.split(',')[0]))
      .withMessage('The field of order is not allow sorting.')
  ],

  validateLimit: () => [
    check('limit')
      .optional()
      .isNumeric()
      .withMessage('The limit must be a number.')
  ],

  validatePage: () => [
    check('page')
      .optional()
      .isNumeric()
      .withMessage('The page must be a number.')
  ]
};

export default Validators;
