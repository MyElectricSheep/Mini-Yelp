const express = require('express');
const seedRouter = express.Router();
const seedController = require('../controllers/seedController')

seedRouter.post('/create', seedController.create);
seedRouter.delete('/destroy', seedController.destroy);
seedRouter.post('/', seedController.seed);

module.exports = seedRouter;
