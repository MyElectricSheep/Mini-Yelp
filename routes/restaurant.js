const express = require('express');
const restaurantRouter = express.Router();
const restaurantController = require('../controllers/restaurantController')

restaurantRouter.get('/:id', restaurantController.readOne);
restaurantRouter.get('/', restaurantController.readAll);
restaurantRouter.post('/', restaurantController.create);
restaurantRouter.put('/:id', restaurantController.update);
restaurantRouter.delete('/:id', restaurantController.delete);

module.exports = restaurantRouter;
