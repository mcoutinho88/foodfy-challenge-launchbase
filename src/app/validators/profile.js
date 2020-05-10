const User = require("../models/User");
const { compare } = require("bcryptjs");

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "")
      return {
        user: body,
        error: "Preencha todos os campos!",
      };
  }
}

async function index(req, res, next) {
  const { userId } = req.session;

  const user = await User.findOne({
     where: {
        id: userId 
      } 
    });

  if (!user)
    return res.render("session/login", {
      error: "Usuário não cadastrado!",
    });

  req.user = user;

  next();
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) return res.render("admin/users/profile", fillAllFields);

  const { id, password } = req.body;

  if (!password)
    return res.render("admin/users/profile", {
      user: req.body,
      error: "Coloque sua senha para atualizar seu cadastro.",
    });

  const user = await User.findOne({ where: { id } });

  const passed = await compare(password, user.password);

  if (!passed)
    return res.render("admin/users/profile", {
      user: req.body,
      error: "Senha incorreta",
    });

  req.user = user;

  next();
}

module.exports = {
  checkAllFields,
  index,
  put
};