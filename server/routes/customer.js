import express from 'express';
import ValidateCustomer from '../middlewares/ValidateCustomer';
import AuthenticateUser from '../middlewares/AuthenticateUser';
import CustomerController from '../controllers/CustomerController';

const customerRoute = express.Router();

customerRoute.post('/customers',
  ValidateCustomer.validateRegistrationFields(),
  ValidateCustomer.registrationDetails,
  CustomerController.registerCustomer);

customerRoute.post('/customers/login',
  ValidateCustomer.validateLoginFields(),
  ValidateCustomer.loginDetails,
  CustomerController.loginCustomer);

customerRoute.put('/customer',
  AuthenticateUser.verifyUser,
  ValidateCustomer.validateAccountDetails(),
  ValidateCustomer.profileUpdateDetails,
  CustomerController.updateCustomerDetails);

export default customerRoute;
