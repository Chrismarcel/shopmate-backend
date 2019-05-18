import express from 'express';
import { ShippingController } from '../controllers';
import { ValidateShipping } from '../middlewares';
import Validator from '../helpers/validators/fieldValidators';

const shippingDetailsRoute = express.Router();

shippingDetailsRoute.get('/shipping/regions', ShippingController.getShippingRegions);

shippingDetailsRoute.get('/shipping/regions/:shipping_region_id',
  Validator.validateId('shipping_region_id'),
  ValidateShipping.validateShippingRegionId,
  ShippingController.getShippingRegionWithId);

export default shippingDetailsRoute;
