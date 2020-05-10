const User = require('../models/User')
const mailer = require('../lib/mailer')
const crypto = require("crypto")
const { hash } = require('bcryptjs')

module.exports = {
  loginForm(req,res){
    return res.render("session/login")
  },
  login(req,res) {
    req.session.userId = req.user.id

    return res.redirect("/admin")
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect('/')
  },
  forgotForm(req,res) {
    return res.render("session/forgot-password")
  },
  async forgot(req,res) {
    try {
      const user = req.user

      const token = crypto.randomBytes(20).toString("hex")

      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      })

      await mailer.sendMail({
        to: user.email,
        from: "no-reply@foodfy.com.br",
        subject: "Recuperação de senha",
        html: `
          <h2>Perdeu a senha?</h2>
          <p>Não se preucupe, clique no link abaixo para recuperar a sua senha</p>
          <p>
            <a href="http://localhost:3000/admin/users/password-reset?token=${token}" target="_blank">
              RECUPERAR SENHA
            </a>
          </p>
        `,
        })

        return res.render("session/forgot-password", {
          success: "Email enviado para recuperar sua senha. Favor verifique seu email"
        })

    } catch (error) {
      console.error(error)
      return res.render("session/forgot-password", {
        error: "Erro inesperado, tente novamente",
      })
    }
  },
  resetForm(req,res){
    return res.render("session/password-reset", { token: req.query.token })
  },
  async reset(req, res) {
    try {
      const user = req.user
      const { password, token } = req.body

      const newPasswordHash = await hash(password, 8)

      await User.update(user.id, {
        password: newPasswordHash,
        reset_token: "",
        reset_token_expires: ""
      })
      
      return res.render("session/login", {
        user:req.body,
        success: "Senha atualizada com sucesso! Faça seu login"
      })
    } catch (error) {
      console.error(error)
      return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "Erro inesperado, tente novamente"
      })
    }
  }
}