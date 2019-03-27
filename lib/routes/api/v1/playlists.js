const express = require('express');
const router = express.Router();
const playlistsController = require('../../../controllers/playlists_controller');
const playlistFavoritesController = require('../../../controllers/playlist_favorites_controller');

router.get('/', playlistsController.index);
router.post('/:playlist_id/favorites/:id', playlistFavoritesController.create);

module.exports = router;
