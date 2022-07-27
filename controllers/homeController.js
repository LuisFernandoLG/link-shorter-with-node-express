const { generate } = require("shortid");
const Url = require("../models/Url");

const readUrls = async (req, res) => {
  try {
    const urlsFromMongo = await Url.find({ user: req.user.id }).lean();
    res.render("home", {
      title: "Acortador Online!",
      urls: urlsFromMongo,
    });
  } catch (error) {
    req.flash("messages", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};

const addUrl = async (req, res) => {
  const { origin } = req.body;
  const { id } = req.user;

  const urlGenerated = generate();
  const url = new Url({ origin: origin, shortedUrl: urlGenerated, user: id });

  try {
    await url.save();
    req.flash("messages", [{ msg: "Url agregada con éxito!" }]);
    res.redirect("/");
  } catch (error) {
    req.flash("messages", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id))
      throw new Error("No tienes los permisos para eliminar esta Url");

    await url.remove();
    req.flash("messages", [{ msg: "Eliminada con éxito!" }]);
    res.redirect("/");
  } catch (error) {
    req.flash("messages", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    const urlFromDb = await Url.findById(id).lean();

    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id))
      throw new Error("No tienes los permisos para eliminar esta Url");

    res.render("home", { title: "Edición", urlFromDb });
  } catch (error) {
    req.flash("messages", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const redirectToPage = async (req, res) => {
  const { shortedUrl } = req.params;

  try {
    const url = await Url.findOne({ shortedUrl: shortedUrl });
    if (!url.origin) throw new Error("No existe el enlace");

    res.redirect(url.origin);
  } catch (error) {
    req.flash("messages", [{ msg: "No existe el enlace" }]);
    return res.redirect("/auth/login");
  }
};

const editUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    const url = await Url.findById(id);
    if (!url) return res.send("No existe esa Url");

    if (!url.user.equals(req.user.id))
      throw new Error("No tienes los permisos para eliminar esta Url");

    await url.updateOne({ origin });
    req.flash("messages", [{ msg: "Actualizada con éxito!" }]);
    res.redirect("/");
  } catch (error) {
    req.flash("messages", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

module.exports = {
  readUrls,
  addUrl,
  deleteUrl,
  editUrlForm,
  editUrl,
  redirectToPage,
};
