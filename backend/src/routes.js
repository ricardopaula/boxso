const express = require('express')

const ShopkeeperController = require('./controllers/ShopkeeperController')
const OrderController = require('./controllers/OrderController')
const SessionController = require('./controllers/SessionController')

// const Blockchain = require('./services/Blockchain')
const Exchange = require('./services/Exchange')


const routes = express.Router()

routes.post('/sessions', SessionController.login)

routes.get('/shopkeepers', ShopkeeperController.index)
routes.get('/shopkeepers/check-credentials', ShopkeeperController.check_credentials)
routes.get('/shopkeepers/show/:uuid', ShopkeeperController.list)

routes.post('/shopkeepers', ShopkeeperController.create)

routes.put('/shopkeepers/:uuid', ShopkeeperController.update)

routes.get('/orders', OrderController.index)
routes.get('/orders/show/:uuid', OrderController.list)
routes.get('/orders/shopkeepers/:uuid', OrderController.list_shopkeeper)
routes.get('/orders/:uuid/status', OrderController.checkStatus)

routes.post('/orders', OrderController.create)

// UTILITARIOS

routes.post('/orders/updatestatus', OrderController.updateStatus)
routes.post('/check', Exchange.check)

routes.get('/teste', OrderController.teste)
routes.get('/account', Exchange.getAccountInfo)


module.exports = routes
