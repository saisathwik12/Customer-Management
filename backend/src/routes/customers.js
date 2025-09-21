const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { check } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post(
  '/',
  [
    check('name').trim().notEmpty(),
    check('phone').trim().notEmpty(),
  ],
  validateRequest,
  customerController.createCustomer
);

router.get('/', customerController.listCustomers);
router.get('/:id', customerController.getCustomerById);
router.put(
  '/:id',
  [
    check('name').optional().trim().notEmpty(),
    check('phone').optional().trim().notEmpty(),
  ],
  validateRequest,
  customerController.updateCustomer
);
router.delete('/:id', customerController.deleteCustomer);

router.get('/:customerId/addresses', customerController.listAddresses);
router.post(
  '/:customerId/addresses',
  [
    check('label').optional().trim(),
    check('address').trim().notEmpty(),
    check('city').trim().notEmpty(),
    check('state').trim().notEmpty(),
    check('pin_code').trim().notEmpty(),
  ],
  validateRequest,
  customerController.createAddress
);
router.put(
  '/:customerId/addresses/:addressId',
  [
    check('label').optional().trim(),
    check('address').optional().trim().notEmpty(),
    check('city').optional().trim().notEmpty(),
    check('state').optional().trim().notEmpty(),
    check('pin_code').optional().trim().notEmpty(),
  ],
  validateRequest,
  customerController.updateAddress
);
router.delete('/:customerId/addresses/:addressId', customerController.deleteAddress);

module.exports = router;