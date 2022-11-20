const express = require('express');
const routes = express.Router();
const uploadController = require('./upload.controller');
const upload = require('../middleware/multer');

routes.post('/album', upload, uploadController.addImage);
routes.put('/album', upload, uploadController.changeImage);
routes.get('/album/', uploadController.getImage);
routes.get('/album/search', uploadController.searchImage);
routes.delete('/album', uploadController.deleteImage);

module.exports = routes;