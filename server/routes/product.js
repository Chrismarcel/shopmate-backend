import express from 'express';
import { ProductController } from '../controllers';
import { ValidateCategory, ValidateProduct } from '../middlewares';
import Validator from '../helpers/validators/validators';

const productRoute = express.Router();

productRoute.get('/products',
  Validator.validateLimit(),
  Validator.validatePage(),
  ValidateCategory.validatePagination,
  ProductController.getAllProducts);

productRoute.get('/products/:product_id',
  Validator.validateId('product_id'),
  ValidateProduct.validateProductId,
  ProductController.getProductWithId);

export default productRoute;
