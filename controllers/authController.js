const { generate } = require("shortid");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require("dotenv").config()

const loginForm = (req, res) => {
  res.render("login");
};

const registerForm = (req, res) => {
  res.render("register");
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("messages", errors.array());
    return res.redirect("/auth/register");
  }

  const { userName, email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) throw new Error("Yas existe el usuario");

    const tokenConfirm = generate();

    user = new User({ userName, email, password, tokenConfirm });
    await user.save();

    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.userEmail,
        pass: process.env.passEmail
      }
    });

    let info = await transporter.sendMail({
      from: '"Luis López 👻" <Luis@luisdev.com>', // sender address
      to: user.email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Verifica tu cuenta de correo", // plain text body
      html: `<a href="${ process.env.HEROKUPATH0 || "https://localhost:5000"}/auth/confirmCount/${user.tokenConfirm}">Verificar</a>`, // html body
    });


    req.flash("messages", [{ msg: "Revisa tu email 🚀" }]);
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("messages", [{ msg: error.message }]);
    return res.redirect("/auth/register");
  }
};

const confirmCount = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) throw new Error("No existe este usuario");

    user.isCountConfirm = true;
    user.tokenConfirm = null;

    await user.save();

    // Pendiente enviar email

    req.flash("messages", [{ msg: "Cuenta verificada!!! ✔✔✔" }]);
  } catch (error) {
    req.flash("messages", [{ msg: error.message }]);
  } finally {
    res.redirect("/auth/login");
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("messages", errors.array());
    return res.redirect("/auth/login");
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error("No existe el email");

    if (!user.isCountConfirm) throw new Error("Revise su email por favor");
    if (!(await user.comparePassword({ candidatePass: password })))
      throw new Error("Contraseña incorrecta");

    // Creando la sesión del usuario a través de password
    req.login(user, function (error) {
      if (error) throw new Error("Erorr al crear la sesión");
      return res.redirect("/");
    });
  } catch (error) {
    req.flash("messages", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};

const closeSession = (req, res) => {
  req.logout((error) => {
    if (!error) return res.redirect("/auth/login");
  });
};

module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmCount,
  loginUser,
  closeSession,
};
