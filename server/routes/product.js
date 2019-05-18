import express from 'express';
import { ProductController } from '../controllers';
import { ValidateCategory, ValidateProduct } from '../middlewares';
import Validator from '../helpers/validators/fieldValidators';

const productRoute = express.Router();

productRoute.get('/products',
  Validator.validatePaginationParams(),
  ValidateCategory.validatePagination,
  ProductController.getAllProducts);

productRoute.get('/products/search',
  Validator.validateSearchQuery('query_string'),
  ValidateProduct.validateProduct,
  ProductController.searchProduct);

productRoute.get('/products/:product_id$',
  Validator.validateId('product_id'),
  ValidateProduct.validateProduct,
  ProductController.getProductWithId);

export default productRoute;
