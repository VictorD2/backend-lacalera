const pool = require("../database");
const ctrlListaProducto = {};

//.get("/:id")
ctrlListaProducto.getListaProductosByPedidoId = async (req, res) => {
  let SQLdatos = `id_lista_producto,nombre_producto, precio, cantidad_lista_producto,lista_producto.id_producto,id_pedido,url_foto_producto`;
  let Joins = `JOIN producto ON producto.id_producto = lista_producto.id_producto`;
  const data = await pool.query(`SELECT ${SQLdatos} FROM lista_producto ${Joins} WHERE id_pedido = ? ORDER BY nombre_producto ASC`, [req.params.id]);
  return res.json(data);
};
// .get("/count")
ctrlListaProducto.getCount = async (req, res) => {};

// .post("/")
ctrlListaProducto.createListaProducto = async (req, res) => {};

// .put("/:id")
ctrlListaProducto.actualizarListaProducto = async (req, res) => {};

// .delete("/:id")
ctrlListaProducto.deleteListaProducto = async (req, res) => {};

module.exports = ctrlListaProducto;
