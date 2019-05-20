import express from 'express';
import { PaymentController } from '../controllers';
import { ValidatePayment, ValidateOrder } from '../middlewares';
import Validator from '../helpers/validators/fieldValidators';

const paymentRoute = express.Router();

paymentRoute.post('/stripe/charge/',
  Validator.validatePayment(),
  ValidatePayment.validatePaymentDetails,
  ValidateOrder.validateOrder,
  PaymentController.makePayment);

export default paymentRoute;
