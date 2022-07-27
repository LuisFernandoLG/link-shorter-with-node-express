module.exports = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else {
    req.flash("messages", { msg: "Necesitas autenticarte" });
    res.redirect("/auth/login");
  }
};
