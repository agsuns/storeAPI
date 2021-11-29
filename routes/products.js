const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} = require('../controllers/products');

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.patch('/:id', patchProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
