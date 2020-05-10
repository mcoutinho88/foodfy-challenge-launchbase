const express = require('express')
const routes = express.Router()

const RecipeController = require('../app/controllers/RecipeController')
const ChefController = require('../app/controllers/ChefController')
const FoodfyController = require('../app/controllers/FoodfyController')
const UserController = require('../app/controllers/UserController')
const ProfileController = require('../app/controllers/ProfileController')
const SessionController = require('../app/controllers/SessionController')

const ProfileValidator = require('../app/validators/profile')
const SessionValidator = require('../app/validators/session')

const { isLoggedRedirectToAdmin, onlyAdmin, onlyUsers } = require('../app/middlewares/session')

const multer = require('../app/middlewares/multer')

routes.get('/', FoodfyController.index )
routes.get('/about', FoodfyController.about)
routes.get('/recipes', FoodfyController.recipes)
routes.get('/recipes/search', FoodfyController.search)
routes.get('/recipes/:id', FoodfyController.recipePage)

routes.get("/admin/recipes", onlyUsers, RecipeController.index); 
routes.get("/admin/recipes/create", onlyUsers, RecipeController.create)
routes.get("/admin/recipes/:id", onlyUsers, RecipeController.show)
routes.get("/admin/recipes/:id/edit", onlyUsers, RecipeController.edit)

routes.post("/admin/recipes", onlyUsers, multer.array("photos", 5),RecipeController.post)
routes.put("/admin/recipes", onlyUsers, multer.array("photos", 5), RecipeController.put)
routes.delete("/admin/recipes", onlyUsers, RecipeController.delete)

routes.get("/admin", function (req, res) {
    return res.redirect("/admin/recipes");
  });


routes.get("/admin/chefs", onlyUsers, ChefController.index); 
routes.get("/admin/chefs/create", onlyAdmin, ChefController.create)
routes.get("/admin/chefs/:id", onlyUsers, ChefController.show)
routes.get("/admin/chefs/:id/edit", onlyAdmin, ChefController.edit)

routes.post("/admin/chefs", onlyAdmin, multer.array("photos", 1), ChefController.post)
routes.put("/admin/chefs", onlyAdmin, multer.array("photos", 1), ChefController.put)
routes.delete("/admin/chefs", onlyAdmin, ChefController.delete)

// Session routes
routes.get('/admin/users/login', isLoggedRedirectToAdmin, SessionController.loginForm)
routes.post('/admin/users/login', SessionValidator.login, SessionController.login)
routes.post('/admin/users/logout', SessionController.logout)

routes.get('/admin/users/forgot-password', SessionController.forgotForm)
routes.post('/admin/users/forgot-password', SessionValidator.forgot, SessionController.forgot)

routes.get('/admin/users/password-reset', SessionController.resetForm)
routes.post('/admin/users/password-reset', SessionValidator.reset, SessionController.reset)

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users/create', onlyAdmin, UserController.create) //Mostrar a lista de usuários cadastrados
routes.get('/admin/users/:id/edit', onlyAdmin, UserController.edit) //Mostrar a lista de usuários cadastrados
routes.get('/admin/users', onlyAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
routes.post('/admin/users', onlyAdmin, UserController.post) //Cadastrar um usuário
routes.put('/admin/users', onlyAdmin, UserController.put) // Editar um usuário
routes.delete('/admin/users', onlyAdmin, UserController.delete) // Deletar um usuário

// Rotas de perfil de um usuário logado
routes.get('/admin/profile', onlyUsers, ProfileValidator.index, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile', onlyUsers, ProfileValidator.put, ProfileController.put)// Editar o usuário logado

module.exports = routes