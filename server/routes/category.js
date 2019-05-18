import express from 'express';
import { CategoryController } from '../controllers';
import { ValidateCategory, ValidateDepartment } from '../middlewares';
import Validator from '../helpers/validators/validators';

const categoryRoute = express.Router();

categoryRoute.get('/categories',
  Validator.validateSortParams('order',
    [
      'name,ASC',
      'name,DESC',
      'category_id,ASC',
      'category_id,DESC',
      'description,ASC',
      'description,DESC'
    ],
    ['name', 'category_id']),
  Validator.validateLimit(),
  Validator.validatePage(),
  ValidateCategory.validatePagination,
  CategoryController.getAllCategories);

categoryRoute.get('/categories/:category_id$',
  Validator.validateId('category_id'),
  ValidateCategory.validateCategoryId,
  CategoryController.getCategoryWithId);

categoryRoute.get('/categories/inProduct/:product_id',
  Validator.validateId('product_id'),
  ValidateCategory.validateProductId,
  CategoryController.getCategoryProducts);

categoryRoute.get('/categories/inDepartment/:department_id?',
  Validator.validateId('department_id', true),
  ValidateDepartment.validateDepartmentId,
  CategoryController.getCategoriesWithDepartmentId);

export default categoryRoute;
