import express from 'express';

import customerRoute from './customer';
import departmentRoute from './department';
import taxRoute from './tax';
import categoryRoute from './category';
import attributeRoute from './attributes';
import shippingDetailsRoute from './shipping';
import productRoute from './product';
import orderRoute from './order';

const router = express.Router();

router.use(customerRoute);
router.use(departmentRoute);
router.use(taxRoute);
router.use(categoryRoute);
router.use(attributeRoute);
router.use(shippingDetailsRoute);
router.use(productRoute);
router.use(orderRoute);

export default router;
