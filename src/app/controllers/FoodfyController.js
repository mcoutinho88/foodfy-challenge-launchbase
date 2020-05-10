const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')


module.exports = {
    async index(req,res) {
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
  
        recipesWithChef = await Promise.all(recipesPromise) 
  
        return res.render("foodfy/index", { recipes:recipesWithChef })
  
        
    },
    
    about(req, res) {
      return res.render("foodfy/about");
    },
    async recipes(req,res) {
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

      recipesWithChef = await Promise.all(recipesPromise) 

      return res.render("foodfy/recipes", { recipes:recipesWithChef })

    },

    async search(req, res) {
     
      let { filter } = req.query

      if (!filter || filter.toLowerCase() == 'toda a loja') filter = null

      let recipes = await Recipe.search( filter )

      const recipePromise = recipes.map(LoadRecipeService.format)
      
      recipes = await Promise.all(recipePromise)
      const search = {
        term: req.query.filter,
        total: recipes.length
      }

      
      return res.render("foodfy/search", { recipes, search })
    },

    async recipePage(req,res) {
        
      try {
        const recipe = await LoadRecipeService.load('recipe',
        {
            where: {
                id: req.params.id
            }
        })

        const chef = await Chef.findOne({
            where: {
                id: recipe.chef_id
            }
        })

        recipe.chef_name = chef.name

      return res.render("foodfy/recipe", { recipe })

    } catch (error) {
      console.error(error)
    } 
  },
  async chefs(req,res) {
    const chefs = await LoadChefService.load('chefs')

    return res.render("foodfy/chefs", { chefs })
}        
}