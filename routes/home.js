const express = require("express");
const {
  readUrls,
  addUrl,
  deleteUrl,
  editUrl,
  editUrlForm,
  redirectToPage,
} = require("../controllers/homeController");
const { userForm, editProfile } = require("../controllers/userController");
const validateUrl = require("../middlewares/validateUrl");
const verifyUser = require("../middlewares/verifyUser");
const router = express.Router();

router.get("/", verifyUser, readUrls);
router.post("/", verifyUser, validateUrl, addUrl);
router.get("/delete/:id", verifyUser, deleteUrl);
router.get("/edit/:id", verifyUser, editUrlForm);
router.post("/edit/:id", verifyUser, editUrl);
router.get("/profile", userForm)
router.post("/profile", editProfile)

router.get("/:shortedUrl", redirectToPage);

// solo se importará la ruta en app.js
module.exports = router;
//
