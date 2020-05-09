const Base = require('./Base')
const db = require('../../config/db')

Base.init({ table: 'recipe_files' })

module.exports = {
    ...Base,
    async deleteRecipe(id) {
        try {
            return await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])
        } catch (error) {
            console.error(error)
        }
    }
}