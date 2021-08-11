const router = require("express").Router();
const ctrlListaProducto = require("../controllers/lista_producto.controllers");

router.get("/count", ctrlListaProducto.getCount);
router.get("/:id", ctrlListaProducto.getListaProductosByPedidoId);
router.post("/", ctrlListaProducto.createListaProducto);
router.put("/:id", ctrlListaProducto.actualizarListaProducto);
router.delete("/:id", ctrlListaProducto.deleteListaProducto);

module.exports = router;
