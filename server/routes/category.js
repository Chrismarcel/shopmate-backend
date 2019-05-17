import express from 'express';
import { CategoryController } from '../controllers';
import { ValidateCategory } from '../middlewares';
import Validator from '../helpers/validators/validators';

const categoryRoute = express.Router();

categoryRoute.get('/categories',
  Validator.validateSortOrder('order',
    [
      'name,ASC',
      'name,DESC',
      'category_id,ASC',
      'category_id,DESC',
      'description,ASC',
      'description,DESC'
    ],
    ['name', 'category_id']),
  ValidateCategory.validatePagination,
  CategoryController.getAllCategories);

categoryRoute.get('/categories/:category_id',
  Validator.validateId('category_id'),
  ValidateCategory.validateCategoryId,
  CategoryController.getCategoryWithId);

export default categoryRoute;
