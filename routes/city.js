const express = require('express');
const cityRouter = express.Router();
const cityController = require('../controllers/cityController')


cityRouter.get('/:id', cityController.readOne);
cityRouter.get('/', cityController.readAll);
cityRouter.post('/', cityController.create);
cityRouter.put('/:id', cityController.update);
cityRouter.delete('/:id', cityController.delete);

module.exports = cityRouter;
