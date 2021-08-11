const pool = require("../database");
const ctrlPedido = {};

//.get("/")
ctrlPedido.getPedidos = async (req, res) => {
  let SQLdatos = `nombre_usuario,apellido_usuario,estado,fecha_pedido,id_pedido,pedido.id_usuario,correo_usuario`;
  let Joins = `JOIN usuario ON usuario.id_usuario = pedido.id_usuario`;
  if (req.query.keyword && req.query.page) {
    const data = await pool.query(`SELECT ${SQLdatos} FROM pedido ${Joins} WHERE nombre_usuario LIKE '%${req.query.keyword}%' OR apellido_usuario LIKE '%${req.query.keyword}%' ORDER BY fecha_pedido ASC`);
    const cantidadDatos = 12;
    const pagina = (parseInt(req.query.page) - 1) * cantidadDatos;
    return res.json(data.splice(pagina, cantidadDatos));
  }

  if (req.query.keyword) {
    const data = await pool.query(`SELECT ${SQLdatos} FROM pedido ${Joins} WHERE nombre_usuario LIKE '%${req.query.keyword}%' OR apellido_usuario LIKE '%${req.query.keyword}%' ORDER BY fecha_pedido ASC`);
    return res.json(data);
  }

  if (req.query.page) {
    const cantidadDatos = 12;
    const pagina = (parseInt(req.query.page) - 1) * cantidadDatos;
    const data = await pool.query(`SELECT ${SQLdatos} FROM pedido ${Joins} ORDER BY fecha_pedido ASC`);
    return res.json(data.splice(pagina, cantidadDatos));
  }

  const data = await pool.query(`SELECT ${SQLdatos} FROM pedido ${Joins} ORDER BY fecha_pedido ASC`);
  return res.json(data);
};

//.get("/:id")
ctrlPedido.getPedido = async (req, res) => {
  let SQLdatos = `nombre_usuario,apellido_usuario,estado,fecha_pedido,id_pedido,pedido.id_usuario,correo_usuario`;
  let Joins = `JOIN usuario ON usuario.id_usuario = pedido.id_usuario`;
  const data = await pool.query(`SELECT ${SQLdatos} FROM pedido ${Joins} id_pedido = ?`, [req.params.id]);
  return res.json(data[0]);
};

// .get("/count")
ctrlPedido.getCount = async (req, res) => {
  let Joins = `JOIN usuario ON usuario.id_usuario = pedido.id_usuario`;
  if (req.query.keyword) {
    const data = await pool.query(`SELECT COUNT(*) FROM pedido ${Joins} WHERE nombre_usuario LIKE '%${req.query.keyword}%' OR apellido_usuario LIKE '%${req.query.keyword}%'`);
    if (data[0]["COUNT(*)"]) return res.json(data[0]["COUNT(*)"]);
    return res.json(0);
  }
  const rows = await pool.query("SELECT COUNT(*) FROM pedido");
  if (rows[0]["COUNT(*)"]) return res.json(rows[0]["COUNT(*)"]);
  return res.json(0);
};

// .post("/")
ctrlPedido.createPedido = async (req, res) => {
  const { usuario, listaProductos, fecha } = req.body;
  const newPedido = {
    estado: 0,
    fecha_pedido: fecha,
    id_usuario: usuario.id_usuario,
  };
  const id_pedido = await pool.query("INSERT INTO pedido set ?", [newPedido]);
  let values = `VALUES `;
  for (let i = 0; i < listaProductos.length; i++) {
    const cantidad_lista_producto = `${listaProductos[i].cantidad_lista_producto}`;
    const id_producto = `${listaProductos[i].id_producto}`;
    values += ` (NULL, '${cantidad_lista_producto}', '${id_producto}', '${id_pedido.insertId}'),`;
  }
  const sqlValues = values.slice(0, values.length - 1);
  const rows = await pool.query(`INSERT INTO lista_producto (id_lista_producto, cantidad_lista_producto, id_producto, id_pedido) ${sqlValues};`);
  return res.json({ success: "Todo good" });
};

// .put("/:id")
ctrlPedido.actualizarPedido = async (req, res) => {
  const pedido = await pool.query("SELECT * FROM pedido WHERE id_pedido = ?", [req.params.id]);
  pedido[0].estado === 0 ? (pedido[0].estado = 1) : (pedido[0].estado = 0);
  const data = await pool.query("UPDATE pedido set ? WHERE id_pedido = ?", [pedido[0], req.params.id]);

  if (data.affectedRows === 1) return res.json({ success: `Estado del pedido actualizado` }); //Se logró actualizar

  res.json({ error: "Ocurrió un error" });
};

// .delete("/:id")
ctrlPedido.deletePedido = async (req, res) => {};

module.exports = ctrlPedido;
