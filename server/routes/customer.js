import express from 'express';
import ValidateCustomer from '../middlewares/ValidateCustomer';
import AuthenticateUser from '../middlewares/AuthenticateUser';
import CustomerController from '../controllers/CustomerController';
import customerValidator from '../helpers/validations/customerValidator';

const customerRoute = express.Router();

customerRoute.post('/customers',
  customerValidator.validateRegistrationFields(),
  ValidateCustomer.registrationDetails,
  CustomerController.registerCustomer);

customerRoute.post('/customers/login',
  customerValidator.validateLoginFields(),
  ValidateCustomer.loginDetails,
  CustomerController.loginCustomer);

customerRoute.put('/customer',
  AuthenticateUser.verifyUser,
  customerValidator.validateProfileDetails(),
  ValidateCustomer.updateProfileDetails,
  CustomerController.updateCustomerProfileDetails);

customerRoute.put('/customers/address',
  AuthenticateUser.verifyUser,
  customerValidator.validateAddressFields(),
  ValidateCustomer.updateAddressDetails,
  CustomerController.updateCustomerAddressDetails);

customerRoute.put('/customers/creditCard',
  AuthenticateUser.verifyUser,
  customerValidator.validateCreditCardField(),
  ValidateCustomer.updateCreditCardDetails,
  CustomerController.updateCustomerCreditCardDetails);

customerRoute.get('/customer', AuthenticateUser.verifyUser, CustomerController.getCustomerDetails);

export default customerRoute;
