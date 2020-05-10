const User = require('../models/User')
const Chef = require('../models/Chef')
const LoadRecipeService = require('../services/LoadRecipeService')

function onlyUsers(req,res,next) {
  if(!req.session.userId)
      return res.redirect("/admin/users/login")
  
  next()
}

async function onlyAdmin(req,res,next) {
  const user = await User.findOne({
    where: {
      id: req.session.userId
    }
  })
  const recipes = await LoadRecipeService.load('recipes')

  const recipesPromise = recipes.map(async (recipe) => {
    let chef = await Chef.findOne({
      where: {
        id: recipe.chef_id
      }
    })
    recipe.chef_name = chef.name
    return recipe
  })

  const recipesWithChef = await Promise.all(recipesPromise)

  if(user.is_admin == false){
      return res.render("admin/recipes/index", {
        error: "Apenas admnistradores podem acessar essa área",
        recipes: recipesWithChef
      })
    }
  next()
}

function isLoggedRedirectToAdmin(req, res, next) {
  if(req.session.userId)
      return res.redirect("/admin")

  next()
}

module.exports = {
  onlyUsers,
  onlyAdmin,
  isLoggedRedirectToAdmin
}