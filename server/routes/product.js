import express from 'express';
import { ProductController } from '../controllers';
import { ValidateCategory, ValidateProduct, ValidateDepartment } from '../middlewares';
import Validator from '../helpers/validators/fieldValidators';

const productRoute = express.Router();

productRoute.get('/products',
  Validator.validatePaginationParams(),
  ValidateCategory.validatePagination,
  ProductController.getAllProducts);

productRoute.get('/products/search',
  Validator.validateSearchQuery('query_string'),
  ValidateProduct.validateProduct,
  ProductController.searchProducts);

productRoute.get('/products/inCategory/:category_id?',
  Validator.validateId('category_id', true),
  ValidateCategory.validateCategoryId,
  ProductController.getSpecificProducts);

productRoute.get('/products/inDepartment/:department_id?',
  Validator.validateId('department_id', true),
  ValidateDepartment.validateDepartmentId,
  ProductController.getSpecificProducts);

productRoute.get('/products/:product_id$',
  Validator.validateId('product_id'),
  ValidateProduct.validateProduct,
  ProductController.getProductWithId);

export default productRoute;
