const express = require('express');
const router = express.Router();
const playlistsController = require('../../../controllers/playlists_controller');

router.get('/', playlistsController.index);

module.exports = router;