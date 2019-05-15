import express from 'express';
import ValidateUser from '../middlewares/ValidateUser';
import UserController from '../controllers/UserController';

const customerRoute = express.Router();

customerRoute.post('/customer',
  ValidateUser.checkUserDetails(),
  ValidateUser.registerUser,
  UserController.register);

export default customerRoute;
