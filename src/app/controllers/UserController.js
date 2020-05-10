const User = require('../models/User')
const crypto = require('crypto')
const { hash } = require('bcryptjs')

module.exports = {
  create(req,res) {
    return res.render('admin/users/create')
  },
  async list(req,res) {
    const users = await User.findAll()

    return res.render('admin/users/index', { users })
  },
  async edit(req,res) {
    const user = await User.findOne({ 
      where: { 
        id: req.params.id 
      } 
    })
    
    return res.render("admin/users/edit", { user })

  },
  async post(req, res){

    let { name, email, is_admin } = req.body

    if (!is_admin) is_admin = false

    //const password = crypto.randomBytes(4).toString('hex')
    const password = '1111'
    const passwordHash = await hash(password,8)
    
    await User.create({
      name,
      email,
      password: passwordHash,
      is_admin
    })
    return res.redirect('/admin/users')
  },
  async put(req,res) {
    try {
      let { id, name, email, is_admin } = req.body

      if (!is_admin) is_admin = false

      await User.update(id, {
        name,
        email,
        is_admin
      })

      return res.redirect(`/admin/users/${req.body.id}/edit`)

    } catch (error) {
      console.error(error)
    }
  },

  async delete(req,res) {
    try {
      await User.delete(req.body.id)
      return res.render('admin/users/index')
    } catch (error) {
      console.error(error)
    }

  }
}