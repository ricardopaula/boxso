const express = require('express');

const ShopkeeperController = require('./controllers/ShopkeeperController');
const OrderController = require('./controllers/OrderController');

const routes = express.Router();

routes.get('/shopkeepers', ShopkeeperController.index);
routes.post('/shopkeepers', ShopkeeperController.create);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.create);

module.exports = routes;
