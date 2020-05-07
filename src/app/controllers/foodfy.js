const Recipe = require('../models/Recipe')
const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')


module.exports = {
    async index(req,res) {
        const recipes = await LoadRecipeService.load('recipes')
            
        return res.render("foodfy/index", { recipes })
        
    },
    
    about(req, res) {
      return res.render("foodfy/about");
    },
    async recipes(req,res) {
      const recipes = await LoadRecipeService.load('recipes')

      return res.render("foodfy/recipes", { recipes })

    },

    async recipePage(req,res) {
        
      try {
        const recipe = await LoadRecipeService.load('recipe',
        {
            where: {
                id: req.params.id
            }
        })

        const chef = await LoadChefService.load('chef', {
            where: {
                id: recipe.chef_id
            }
        })


      return res.render("foodfy/recipe", { recipe, chef })

    } catch (error) {
      console.error(error)
    } 
  }        
}