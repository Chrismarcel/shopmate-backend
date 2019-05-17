import express from 'express';
import { DepartmentController } from '../controllers';
import { ValidateDepartment } from '../middlewares';
import departmentValidator from '../helpers/validators/departmentValidator';

const departmentRoute = express.Router();

departmentRoute.get('/departments', DepartmentController.getAllDepartments);

departmentRoute.get('/departments/:department_id',
  departmentValidator.validateDepartmentId(),
  ValidateDepartment.validateDepartmentId,
  DepartmentController.getDepartmentWithId);

export default departmentRoute;
