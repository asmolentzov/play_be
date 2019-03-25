const express = require('express');
const router = express.Router();
const favoritesController = require('../../../controllers/favorites_controller');

router.get('/', favoritesController.index);
router.post('/', favoritesController.create);
router.get('/:id', favoritesController.show);
router.put('/:id', favoritesController.update);
router.delete('/:id', favoritesController.destroy);

module.exports = router;