const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')
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
    
          const recipesWithChef = await Promise.all(recipesPromise) 
            
        return res.render("admin/recipes/index", { recipes: recipesWithChef })
        
    },
    
    async create(req,res) {
        try {
            const chefs = await LoadChefService.load('chefs')

            return res.render("admin/recipes/create", { chefs })
        } catch (error) {
            console.error(error)
        }
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

            const chefs = await LoadChefService.load('chefs')

            
            return res.render("admin/recipes/edit", { recipe, chefs })
          } catch (error) {
            console.error(error)
          }
    },
    
    
    
    async post(req,res) {
        try {
            
            if (req.files.length == 0) 
                return res.send("Por favor, envie pelo menos uma imagem")
              
            let { chef, user_id, title, information, ingredients, preparation } = req.body
            
            const recipeId = await Recipe.create({
                chef_id: chef,
                user_id,
                title,
                ingredients,
                preparation,
                information
            })
    
            const filesPromise = req.files.map(async (file) => { 
                let file_id = await File.create({
                    name: file.filename,
                    path: file.path
                })
                recipe_id = recipeId
                await RecipeFile.create({
                    recipe_id,
                    file_id
                })
            })
            await Promise.all(filesPromise)

            return res.redirect(`/admin/recipes/${recipeId}/edit`)
            
        } catch (error) {
            console.error(error)
        }

    },
    
    async put(req,res) {
        try {
            const keys = Object.keys(req.body)
    
            for(key of keys) {
                if (req.body[key] == "" && key != "removed_files") {
                    return res.send('Please, fill all fields!')
                }
            }

            const recipeId = req.body.id

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(async (file) => { 
                    let file_id = await File.create({
                    name: file.filename,
                    path: file.path
                })
                recipe_id = recipeId
                await RecipeFile.create({
                    recipe_id,
                    file_id
                })
            })
                await Promise.all(newFilesPromise)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length-1
                removedFiles.splice(lastIndex,1)

                const removedFilesPromise = removedFiles.map(async (id) => {
                    await RecipeFile.deleteRecipe(id)
                    await File.deleteFilesFromStorage(id)
                })

                await Promise.all(removedFilesPromise)
            }
    
            await Recipe.update(req.body.id, {
                chef_id: req.body.chef,
                title: req.body.title, 
                ingredients: req.body.ingredients, 
                preparation: req.body.preparation, 
                information: req.body.information
            })
                
            return res.redirect(`/admin/recipes/${req.body.id}/edit`)
            
        } catch (error) {
            console.error(error)
        }
    
    },
    
    async delete(req,res) {
        const filesToDelete = await RecipeFile.findAll({ where: { recipe_id: req.body.id }})

        const filesToDeletePromise = filesToDelete.map(async (file) => await File.deleteFilesFromStorage(file.file_id))        
        await Promise.all(filesToDeletePromise)

        await Recipe.delete(req.body.id)
        return res.redirect('/admin/recipes/')              
    },

    
}