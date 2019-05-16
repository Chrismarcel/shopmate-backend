import express from 'express';
import ValidateCustomer from '../middlewares/ValidateCustomer';
import AuthenticateUser from '../middlewares/AuthenticateUser';
import CustomerController from '../controllers/CustomerController';
import CustomerValidation from '../helpers/validations/CustomerValidation';

const customerRoute = express.Router();

customerRoute.post('/customers',
  CustomerValidation.validateRegistrationFields(),
  ValidateCustomer.registrationDetails,
  CustomerController.registerCustomer);

customerRoute.post('/customers/login',
  CustomerValidation.validateLoginFields(),
  ValidateCustomer.loginDetails,
  CustomerController.loginCustomer);

customerRoute.put('/customer',
  AuthenticateUser.verifyUser,
  CustomerValidation.validateAccountDetails(),
  ValidateCustomer.profileUpdateDetails,
  CustomerController.updateCustomerDetails);

customerRoute.get('/customer', AuthenticateUser.verifyUser, CustomerController.getCustomerDetails);

export default customerRoute;
