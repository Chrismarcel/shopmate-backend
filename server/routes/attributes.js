import express from 'express';
import { AttributeController } from '../controllers';
import { ValidateAttribute, ValidateProduct } from '../middlewares';
import Validator from '../helpers/validators/validators';

const attributesRoute = express.Router();

attributesRoute.get('/attributes', AttributeController.getAllAttributes);

attributesRoute.get('/attributes/:attribute_id',
  Validator.validateId('attribute_id'),
  ValidateAttribute.validateAttributeId,
  AttributeController.getAttributeWithId);

attributesRoute.get('/attributes/values/:attribute_id',
  Validator.validateId('attribute_id'),
  ValidateAttribute.validateAttributeId,
  AttributeController.getAttributeValues);

attributesRoute.get('/attributes/inProduct/:product_id',
  Validator.validateId('product_id'),
  ValidateProduct.validateProductId,
  AttributeController.getAttributesInProduct);

export default attributesRoute;
