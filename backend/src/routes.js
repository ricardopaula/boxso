const express = require('express')

const ShopkeeperController = require('./controllers/ShopkeeperController')
const OrderController = require('./controllers/OrderController')
const SessionController = require('./controllers/SessionController')

// const Blockchain = require('./services/Blockchain')
const Exchange = require('./services/Exchange')


const routes = express.Router()

routes.get('/api', SessionController.index)

routes.post('/api/sessions', SessionController.login)
routes.get('/api/sessions/check-credentials', SessionController.checkCredentials)

routes.get('/api/shopkeepers', ShopkeeperController.index)
routes.get('/api/shopkeepers/show/:uuid', ShopkeeperController.list)

routes.post('/api/shopkeepers', ShopkeeperController.create)

routes.put('/api/shopkeepers/:uuid', ShopkeeperController.update)

routes.get('/api/orders', OrderController.index)
routes.get('/api/orders/show/:uuid', OrderController.list)
routes.get('/api/orders/shopkeepers/:uuid', OrderController.listShopkeeper)
routes.get('/api/orders/:uuid/status', OrderController.checkStatus)
routes.get('/api/orders/latest', OrderController.latestConfirmedList)

routes.post('/api/orders', OrderController.create)

// UTILITARIOS

routes.post('/api/orders/updatestatus', OrderController.updateStatus)
routes.post('/api/check', Exchange.check)
routes.post('/api/checkblockchain', Exchange.checkBlockchain)


routes.get('/api/teste', OrderController.teste)
routes.get('/api/account', Exchange.getAccountInfo)


module.exports = routes
