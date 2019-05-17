import express from 'express';
import { TaxController } from '../controllers';
import { ValidateTax } from '../middlewares';
import IDValidator from '../helpers/validators/idValidator';

const taxRoute = express.Router();

taxRoute.get('/tax', TaxController.getAllTaxes);

taxRoute.get('/tax/:tax_id',
  IDValidator.validateId(),
  ValidateTax.validateTaxId,
  TaxController.getTaxWithId);

export default taxRoute;
