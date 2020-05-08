const Base = require('./Base')
const db = require('../../config/db')
Base.init({ table: 'recipes' })

module.exports = {
    ...Base,

    async search(filter) {
      let query = `
        SELECT recipes.*,
          chefs.name AS chef_name

        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE 1 = 1  
      `
      if (filter) {
        query += ` AND (recipes.title ilike '%${filter}%'
        OR recipes.information ilike '%${filter}%')`
      }

      const results = await db.query(query)
      return results.rows
    }
}