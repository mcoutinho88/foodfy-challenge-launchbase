const express = require('express')
const routes = express.Router()
const admin = require("./admin");

const FoodfyController = require('../app/controllers/FoodfyController')

routes.use("/admin", admin);

routes.get('/', FoodfyController.index )
routes.get('/about', FoodfyController.about)
routes.get('/recipes', FoodfyController.recipes)
routes.get('/recipes/search', FoodfyController.search)
routes.get('/recipes/:id', FoodfyController.recipePage)
routes.get('/chefs', FoodfyController.chefs)

module.exports = routes
