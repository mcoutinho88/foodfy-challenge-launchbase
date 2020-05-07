const Recipe = require('../models/Recipe')
const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')



module.exports = {
    async index(req,res) {
        const recipes = await LoadRecipeService.load('recipes')
            
        return res.render("admin/recipes/index", { recipes })
        
    },
    
    create(req,res) {
        return res.render("admin/recipes/create")
    },
    
    
    async show(req,res) {
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


            return res.render("admin/recipes/show", { recipe, chef })


        } catch (error) {
            console.error(error)
        }

    },
    
    async edit(req,res) {
        // Recipe.find(req.params.id, (recipe) => {
        //     if(!recipe) return res.send("Recipe not found!")

        //     Recipe.chefsSelectOptions((options) => (
        //         res.render(`admin/recipes/edit`, { recipe, chefOptions: options })
        //     ))

            
        // })
        try {
            const recipe = await LoadRecipeService.load('recipe', {
                where: {
                    id: req.params.id
                }
            })
            
            return res.render("admin/recipes/edit", { recipe })
          } catch (error) {
            console.error(error)
          }
    },
    
    
    
    async post(req,res) {
        try {
            let { image, title, ingredients, preparation, information } = req.body
            
    
            const recipeId = Recipe.create({
                image, 
                title, 
                ingredients, 
                preparation, 
                information
            })
    
            return res.redirect(`/admin/recipes/${recipeId}/edit`)
            
        } catch (error) {
            console.error(error)
        }

    },
    
    async put(req,res) {
        try {
            const keys = Object.keys(req.body)
    
            for(key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please, fill all fields!')
                }
            }
    
            await Recipe.update(req.body.id, {
                image: req.body.image, 
                title: req.body.title, 
                ingredients: req.body.ingredients, 
                preparation: req.body.preparation, 
                information: req.body.information
            })
                
            return res.redirect(`/admin/recipes/${req.body.id}`)
            
        } catch (error) {
            console.error(error)
        }
    
    },
    
    async delete(req,res) {
        await Recipe.delete(req.body.id)
        return res.redirect('/admin/recipes/')              
    },

    
}