const router = require("express").Router();
const path = require("path");
const { isAdmin, isLoggedIn, isNotLoggedIn } = require("../lib/auth");

router.get("/registrarme", [isNotLoggedIn], (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/mi-carrito", [isLoggedIn], (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/profile", [isLoggedIn], (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/iniciar-sesion", [isNotLoggedIn], (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/Dashboard", [isLoggedIn, isAdmin], (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/Dashboard/*", [isLoggedIn, isAdmin], (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
router.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

module.exports = router;
