const router = require("express").Router();
const passport = require("passport");

//Registrarse
router.post("/signup", async (req, res, next) => {
  passport.authenticate("local.signup", function (err, user, info) {
    if (err) return res.json({ error: err });

    if (!user) return res.json("Ocurrió un error");

    req.logIn(user, function (err) {
      if (err) return res.json(err);
      user.authenticate = true;
      return res.json({ success: "Sesión Iniciada", user: user });
    });
  })(req, res, next);
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local.signin", function (err, user, info) {
    if (err) return res.json({ error: err });

    if (!user) return res.json("Ocurrió un error");

    req.logIn(user, function (err) {
      if (err) return res.json(err);
      user.authenticate = true;
      return res.json({ success: "Sesión Iniciada", user: user });
    });
  })(req, res, next);
});

//Desconectarse
router.get("/logout", (req, res) => {
  req.logOut();
  res.json({ success: "Desconectado" });
});

module.exports = router;
