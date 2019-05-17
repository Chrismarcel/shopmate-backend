import express from 'express';
import { DepartmentController } from '../controllers';
import { ValidateDepartment } from '../middlewares';
import IDValidator from '../helpers/validators/idValidator';

const departmentRoute = express.Router();

departmentRoute.get('/departments', DepartmentController.getAllDepartments);

departmentRoute.get('/departments/:department_id',
  IDValidator.validateId(),
  ValidateDepartment.validateDepartmentId,
  DepartmentController.getDepartmentWithId);

export default departmentRoute;
