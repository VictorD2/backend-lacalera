module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/iniciar-sesion");
  },

  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/");
  },
  isAdmin(req, res, next) {
    if (!req.user.id_rango == 2) {
      return next();
    }
    return res.redirect("/");
  },
};
