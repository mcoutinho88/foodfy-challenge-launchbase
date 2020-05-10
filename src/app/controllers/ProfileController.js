const User = require('../models/User')

module.exports = {
  async index(req, res) {
    const user = req.user

    return res.render("admin/users/profile", { user })
  },
  async put(req, res) {
    try {
      const { user } = req

      let { name, email } = req.body

      await User.update(user.id, {
        name,
        email
      })
      
      return res.render("admin/users/profile", {
        success: "Conta atualizada com sucesso!"
      })
    } catch (error) {
      console.error(error)
      return res.render("admin/users/profile", {
        error: "Erro inesperado, tente novamente"
      })
    }
  }
}