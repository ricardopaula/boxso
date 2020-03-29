const express = require('express');

const ShopkeeperController = require('./controllers/ShopkeeperController');
const OrderController = require('./controllers/OrderController');

const Blockchain = require('./services/Blockchain');

const routes = express.Router();

routes.get('/shopkeepers', ShopkeeperController.index);
routes.post('/shopkeepers', ShopkeeperController.create);

routes.get('/orders', OrderController.index);
routes.get('/orders/:uuid/status', OrderController.checkStatus);
routes.post('/orders', OrderController.create);


// UTILITARIOS

routes.post('/orders/updatestatus', OrderController.updateStatus);
routes.post('/check', Blockchain.check);

module.exports = routes;
