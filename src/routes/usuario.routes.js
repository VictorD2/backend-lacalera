const router = require("express").Router();
const ctrlUsuario = require("../controllers/usuario.controllers");

router.get("/", ctrlUsuario.getUsuarios);
router.get("/count", ctrlUsuario.getCount);
router.get("/whoami", ctrlUsuario.whoami);
router.get("/:id", ctrlUsuario.getUsuario);
router.post("/", ctrlUsuario.createUsuario);
router.put("/:id", ctrlUsuario.actualizarUsuario);
router.delete("/:id", ctrlUsuario.deleteUsuario);

module.exports = router;
