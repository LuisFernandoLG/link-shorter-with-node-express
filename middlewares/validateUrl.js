const { isUrlValidated } = require("../helpers/isUrlValidated");

const validateUrl = (req, res, next) => {
  const { origin } = req.body;
  try {
    const isUrlOkay = isUrlValidated({ url: origin });
    if (isUrlOkay) next();
    else throw new Error("Ocurrió un error con la URL 😢");
  } catch (error) {
    req.flash("messages", [{ msg: error.message }]);
    res.redirect("/");
  }
};

module.exports = validateUrl;
