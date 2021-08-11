const router = require("express").Router();
const ctrlPedido = require("../controllers/Pedido.controllers");

router.get("/", ctrlPedido.getPedidos);
router.get("/count", ctrlPedido.getCount);
router.get("/:id", ctrlPedido.getPedido);
router.post("/", ctrlPedido.createPedido);
router.put("/:id", ctrlPedido.actualizarPedido);
router.delete("/:id", ctrlPedido.deletePedido);

module.exports = router;
