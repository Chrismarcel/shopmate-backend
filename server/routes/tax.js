import express from 'express';
import { TaxController } from '../controllers';
import { ValidateTax } from '../middlewares';
import Validator from '../helpers/validators/validators';

const taxRoute = express.Router();

taxRoute.get('/tax', TaxController.getAllTaxes);

taxRoute.get('/tax/:tax_id',
  Validator.validateId('tax_id'),
  ValidateTax.validateTaxId,
  TaxController.getTaxWithId);

export default taxRoute;
