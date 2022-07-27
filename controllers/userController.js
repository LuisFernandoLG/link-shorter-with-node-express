const formidable = require("formidable");
const path = require("path")
const fs = require("fs");
const User = require("../models/User");
const Jimp = require("jimp")

module.exports.userForm = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    return res.render("profile", {user: req.user, image: user.image})
  } catch (error) {
    req.flash("messages", [{msg:"Algo salió mal"}])
    return res.redirect("/profile")
  }
};

module.exports.editProfile = (req, res) => {
  const form = new formidable.IncomingForm();
  form.maxFilesSize = 50 * 1014 * 1024; // 50MB

  form.parse(req, async (errors, fields, files) => {
    try {
      if (errors) throw new Error("falló formidable");

      const { myFile } = files;
      if (myFile.originalFileName === "")
        throw new Error("Por favor, selecciona una imagen");

      const imageTypes = ["image/png", "image/jpeg"];
      if (!imageTypes.includes(myFile.mimetype))
        throw new Error("Por favor, selecciona el formato correcto");

      if (myFile.size > 50 * 1024 * 1024)
        throw new Error("Selecciona una imagen más pequeña");

      const extension = myFile.mimetype.split("/")[1]
      
      const dirFile = path.join(__dirname, `../public/assets/images/profiles/${req.user.id}.${extension}`)
      fs.renameSync(myFile.filepath, dirFile)


      const image = await Jimp.read(dirFile)
      image.resize(200, 200).quality(80).writeAsync(dirFile)
      

      const user = await User.findById(req.user.id)
      user.image = `${req.user.id}.${extension}`
      await user.save()

      req.flash("messages", [{ msg: "Todo correcto, imagen subida" }]);
      return res.redirect("/profile");
    } catch (error) {
      req.flash("messages", [{ msg: error.message }]);
      return res.redirect("/profile");
    }
  });
};


