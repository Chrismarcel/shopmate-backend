import express from 'express';
import { DepartmentController } from '../controllers';
import { ValidateDepartment } from '../middlewares';
import Validator from '../helpers/validators/fieldValidators';

const departmentRoute = express.Router();

departmentRoute.get('/departments', DepartmentController.getAllDepartments);

departmentRoute.get('/departments/:department_id',
  Validator.validateId('department_id'),
  ValidateDepartment.validateDepartmentId,
  DepartmentController.getDepartmentWithId);

export default departmentRoute;
