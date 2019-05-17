import express from 'express';

import customerRoute from './customer';
import departmentRoute from './department';

const router = express.Router();

router.use(customerRoute);
router.use(departmentRoute);

export default router;
