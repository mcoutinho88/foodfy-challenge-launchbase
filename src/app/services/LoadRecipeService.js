const Recipe = require('../models/Recipe')

//const { formatPrice, date } = require('../lib/utils')


async function getImages(recipeId) {
    let files = await Recipe.files(recipeId)
    files = files.map(file => ({
        ...file,
        file_path: `${file.file_path.replace("public","")}`   
     }))

    return files
}

async function format(recipe) {
    const files = await getImages(recipe.id)
    // recipe.img = files[0].src
    recipe.files = files
    // recipe.formattedPrice = formatPrice(recipe.price)
    // recipe.formattedOldPrice = formatPrice(recipe.old_price)

    // const { day, hour, minutes, month } = date(recipe.updated_at)
    //         recipe.published = {
    //             day: `${day}/${month}`,
    //             hour: `${hour}:${minutes}`
    //         }
    
    return recipe
  
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async recipe() {
        try {
            const recipe = await Recipe.findOne(this.filter)
            return format(recipe)

        }   catch (error) {
            console.error(error)
        }
        
    },
    async recipes(){
        try {
            const recipes = await Recipe.findAll(this.filter)
            const recipesPromise = recipes.map(format)
            return Promise.all(recipesPromise)

        }   catch (error) {
            console.error(error)
        }
    },
    // async recipeWithDeleted() {
    //     try {
    //         let recipe = await Recipe.findOneWithDeleted(this.filter)
    //         return format(recipe)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // },
    format,
}

module.exports = LoadService