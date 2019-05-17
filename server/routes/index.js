import express from 'express';

import customerRoute from './customer';
import departmentRoute from './department';
import taxRoute from './tax';
import categoryRoute from './category';

const router = express.Router();

router.use(customerRoute);
router.use(departmentRoute);
router.use(taxRoute);
router.use(categoryRoute);

export default router;
