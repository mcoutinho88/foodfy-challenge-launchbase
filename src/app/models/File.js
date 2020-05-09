const Base = require('./Base')
const fs = require('fs'
)
Base.init({ table: 'files' })

module.exports = {
    ...Base,
    async deleteFilesFromStorage(id) {
        try {
            const file = await this.findOne({where: { id } })

            fs.unlinkSync(file.path)

            return this.delete(id)

        } catch (error) {
            console.error(error)
        }
    }

    
}