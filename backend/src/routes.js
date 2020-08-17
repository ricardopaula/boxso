const express = require('express')

const ShopkeeperController = require('./controllers/ShopkeeperController')
const OrderController = require('./controllers/OrderController')
const SessionController = require('./controllers/SessionController')
const authMiddleware = require('./middlewares/auth')

// const Blockchain = require('./services/Blockchain')
const Exchange = require('./services/Exchange')


const routes = express.Router()

// Webservice routes
routes.get('/api', SessionController.index)

// Webservice authenticated routes
routes.get('/api/sessions/check-credentials', SessionController.checkCredentials)
routes.get('/api/orders/:uuid/status', OrderController.checkStatus)
routes.get('/api/orders/latest', OrderController.latestConfirmedList)
routes.post('/api/orders', OrderController.create)

// Frontend routes
routes.post('/api/portal/sessions', SessionController.login)

// Frontend authenticated routes
routes.get('/api/portal/shopkeepers', authMiddleware, ShopkeeperController.index)
routes.get('/api/portal/shopkeepers/show/:uuid', authMiddleware, ShopkeeperController.list)
routes.post('/api/portal/shopkeepers', authMiddleware, ShopkeeperController.create)
routes.put('/api/portal/shopkeepers/:uuid', authMiddleware, ShopkeeperController.update)
routes.get('/api/portal/orders', authMiddleware, OrderController.index)
routes.get('/api/portal/orders/show/:uuid', authMiddleware, OrderController.list)
routes.get('/api/portal/orders/shopkeepers/:uuid', authMiddleware, OrderController.listShopkeeper)

// tests routes
// routes.post('/api/orders/updatestatus', OrderController.updateStatus)
// routes.post('/api/check', Exchange.check)
// routes.post('/api/checkblockchain', Exchange.checkBlockchain)
// routes.get('/api/teste', OrderController.teste)
// routes.get('/api/account', Exchange.getAccountInfo)

module.exports = routes
