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

  validateLimit: field => [check(field).optional.isNumeric()]
};

export default Validators;
