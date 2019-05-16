import express from 'express';
import ValidateUser from '../middlewares/ValidateUser';
import UserController from '../controllers/UserController';

const customerRoute = express.Router();

customerRoute.post('/customers',
  ValidateUser.validateRegistrationFields(),
  ValidateUser.registerUser,
  UserController.register);

customerRoute.post('/customers/login',
  ValidateUser.validateLoginFields(),
  ValidateUser.loginUser,
  UserController.login);

export default customerRoute;
