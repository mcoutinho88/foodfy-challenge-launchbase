const Base = require('./Base')
const db = require('../../config/db')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async files(id) {
        try {
            const query = `
                SELECT files.*, files.path as file_path
                FROM files
                WHERE files.id = '${id}'
            `
            const results = await db.query(query)
            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async countRecipes(chefId) {
        try {
            const query = `
                SELECT count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                WHERE chefs.id = '${chefId}'
                GROUP BY chefs.id
            `
            const results = await db.query(query)
            return results.rows[0].total_recipes

        } catch (error) {
            console.error(error)
        }
    }
}