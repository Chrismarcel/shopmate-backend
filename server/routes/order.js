import express from 'express';
import { OrderController } from '../controllers';
import { ValidateOrder, AuthenticateUser } from '../middlewares';
import Validator from '../helpers/validators/fieldValidators';

const orderRoute = express.Router();

orderRoute.get('/orders/inCustomer',
  AuthenticateUser.verifyUser,
  OrderController.getCustomerOrders);

orderRoute.get('/orders/:order_id',
  AuthenticateUser.verifyUser,
  Validator.validateId('order_id'),
  ValidateOrder.validateOrder,
  OrderController.getOrderWithId);

orderRoute.get('/orders/shortDetails/:order_id',
  AuthenticateUser.verifyUser,
  Validator.validateId('order_id'),
  ValidateOrder.validateOrder,
  OrderController.getOrderShortDetails);

orderRoute.post('/orders',
  AuthenticateUser.verifyUser,
  Validator.validateOrderFields(),
  ValidateOrder.validateOrder,
  OrderController.postOrder);

export default orderRoute;
