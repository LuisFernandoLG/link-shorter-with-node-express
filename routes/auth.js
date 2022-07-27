const express = require("express");
const { body } = require("express-validator");
const {
  loginForm,
  registerForm,
  registerUser,
  confirmCount,
  loginUser,
  closeSession,
} = require("../controllers/authController");
const router = express.Router();

router.get("/register", registerForm);
router.post(
  "/register",
  [
    body("userName", "Ingrese un nombre válido").trim().notEmpty().escape(),
    body("email", "Ingrese un correo válido").trim().isEmail().normalizeEmail(),
    body("password", "Contraseña mínimo de 6 carácteres")
      .trim()
      .isLength({ min: 6 })
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("Contraseñas no iguales");
        }
        return value;
      }),
  ],
  registerUser
);
router.get("/login", loginForm);
router.post(
  "/login",
  [
    body("email", "Ingrese un correo válido").trim().isEmail().normalizeEmail(),
    body("password", "Contraseña mínimo de 6 carácteres")
      .trim()
      .isLength({ min: 6 })
      .escape(),
  ],
  loginUser
);
router.get("/confirmCount/:token", confirmCount);
router.get("/logout", closeSession);

module.exports = router;
