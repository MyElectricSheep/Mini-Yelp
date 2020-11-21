const express = require('express');
const tagRouter = express.Router();
const tagController = require('../controllers/tagController')

tagRouter.get('/:id', tagController.readOne);
tagRouter.get('/', tagController.readAll);
tagRouter.post('/', tagController.create);
tagRouter.put('/:id', tagController.update);
tagRouter.delete('/:id', tagController.delete);

module.exports = tagRouter;
