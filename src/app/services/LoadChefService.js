const Chef = require('../models/Chef')

const { date } = require('../lib/utils')


async function getImages(chefId) {
    let files = await Chef.files(chefId)
    files = files.map(file => ({
        ...file,
        file_path: `${file.path.replace("public","")}`
    }))

    return files
}


async function format(chef) {
    const files = await getImages(chef.file_id)
    const total_recipes = await Chef.countRecipes(chef.id)
    chef.files = files
    chef.total_recipes = total_recipes

    const { day, hour, minutes, month } = date(chef.updated_at)
            chef.published = {
                day: `${day}/${month}`,
                hour: `${hour}:${minutes}`
            }
    
    return chef
  
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async chef() {
        try {
            const chef = await Chef.findOne(this.filter)
            return format(chef)

        }   catch (error) {
            console.error(error)
        }
        
    },
    async chefs(){
        try {
            const chefs = await Chef.findAll(this.filter)
            const chefsPromise = chefs.map(format)
            return Promise.all(chefsPromise)

        }   catch (error) {
            console.error(error)
        }
    },
    async chefWithDeleted() {
        try {
            let chef = await Chef.findOneWithDeleted(this.filter)
            return format(chef)
        } catch (error) {
            console.error(error)
        }
    },
    format,
}

module.exports = LoadService