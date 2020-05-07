const Chef = require('../models/Chef')

//const { formatPrice, date } = require('../lib/utils')


async function getImages(chefId) {
    let files = await Chef.files(chefId)
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public","").replace(/\\/g,"\\\\")}`
    }))

    return files
}

async function format(chef) {
    // const files = await getImages(chef.id)
    // chef.img = files[0].src
    // chef.files = files
    // chef.formattedPrice = formatPrice(chef.price)
    // chef.formattedOldPrice = formatPrice(chef.old_price)

    // const { day, hour, minutes, month } = date(chef.updated_at)
    //         chef.published = {
    //             day: `${day}/${month}`,
    //             hour: `${hour}:${minutes}`
    //         }
    
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