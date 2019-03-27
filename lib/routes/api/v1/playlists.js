const express = require('express');
const router = express.Router();
const playlistsController = require('../../../controllers/playlists_controller');
const playlistFavoritesController = require('../../../controllers/playlist_favorites_controller');

router.get('/', playlistsController.index);
router.post('/', playlistsController.create);
router.delete('/:id', playlistsController.destroy)

router.get('/:playlist_id/favorites', playlistsController.show);
router.post('/:playlist_id/favorites/:id', playlistFavoritesController.create);
router.delete('/:playlist_id/favorites/:id', playlistFavoritesController.destroy);

module.exports = router;
