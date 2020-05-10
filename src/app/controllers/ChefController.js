const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')

const LoadChefService = require('../services/LoadChefService')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req,res) {
        try {
          const chefs = await LoadChefService.load('chefs')
          
          return res.render("admin/chefs/index", { chefs })
        } catch (error) {
          console.error(error)
        }
        
    },
    
    create(req,res) {
        return res.render("admin/chefs/create")
    },
    
    
    async show(req,res) {
        try {
            const allRecipes = await LoadRecipeService.load('recipes')

            const chef = await LoadChefService.load('chef', {
                where: {
                    id: req.params.id
                }
            })

            const recipes = allRecipes.filter((recipe) => recipe.chef_id == chef.id)

            return res.render("admin/chefs/show", { chef, recipes })

 
        } catch (error) {
            console.error(error)
        }
    },
    
    async edit(req,res) {
        try {
            const chef = await LoadChefService.load('chef', {
                where: {
                    id: req.params.id
                }
            })
            
            return res.render("admin/chefs/edit", { chef })
          } catch (error) {
            console.error(error)
          }
        
    },
    
    async post(req,res) {
        try {
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == "") 
                    return res.send("Please, fill all the fields!");
            }
                    
            if (req.files.length == 0) 
                return res.send("Por favor, envie pelo menos uma imagem")
            

            const fileId = await File.create({
                name: req.files[0].filename,
                path: req.files[0].path
            })
            
            
            const chefId = await Chef.create({ 
                name: req.body.name, 
                file_id: fileId
            })

        
            return res.redirect(`/admin/chefs/${chefId}/edit`)

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
    
            if (req.files.length != 0) {
                fileId = await File.create({
                    name: req.files[0].filename,
                    path: req.files[0].path
                })
            }
            
            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length-1
                removedFiles.splice(lastIndex,1)

                await File.deleteFilesFromStorage(removedFiles)
            }

            await Chef.update(req.body.id, {
                name: req.body.name,
                file_id: fileId
            })
    
            return res.redirect(`/admin/chefs/${req.body.id}/edit`)
            
        } catch (error) {
            console.error(error)
        }
    },
    
    async delete(req,res) {
        try {
            const chef = await LoadChefService.load('chef', {
                where: {
                    id: req.body.id
                }
            })

            if(chef.total_recipes > 0)
                return res.send("Você não deve deletar um chef com receitas!")

            await Chef.delete(req.body.id)
            await File.deleteFilesFromStorage(chef.file_id)
            return res.redirect('/admin/chefs')

        } catch (error) {
            console.error(error)
        }

    },

    
}