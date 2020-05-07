const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
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
                        
            let { name, avatar_url } = req.body

            const chefId = await Chef.create({ 
                name, 
                avatar_url
            })

            // const filesPromise = req.files.map(file =>  File.create({ 
            //     name: file.filename,
            //     path: file.path, 
            //     product_id: productId 
            // }))
            // await Promise.all(filesPromise)

            return res.redirect(`/admin/chefs/${chefId}/edit`)

        } catch (error) {

            console.error(error)

        }
        

    },
    
    async put(req,res) {
        
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }

        await Chef.update(req.body.id, {
            name: req.body.name,
            avatar_url: req.body.avatar_url
        })

        return res.redirect(`/admin/chefs/${req.body.id}/edit`)
    },
    
    async delete(req,res) {
        await Chef.delete(req.body.id)
        return res.redirect('/admin/chefs')
    },

    
}