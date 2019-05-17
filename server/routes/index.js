import express from 'express';

import customerRoute from './customer';
import departmentRoute from './department';
import taxRoute from './tax';

const router = express.Router();

router.use(customerRoute);
router.use(departmentRoute);
router.use(taxRoute);

export default router;
