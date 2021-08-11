const pool = require("../database");
const ctrlProducto = {};
const path = require("path");
const fs = require("fs-extra");

//.get("/")
ctrlProducto.getProductos = async (req, res) => {
  if (req.query.keyword && req.query.page) {
    const data = await pool.query(`SELECT * FROM producto WHERE nombre_producto LIKE '%${req.query.keyword}%' ORDER BY nombre_producto ASC`);
    const cantidadDatos = 12;
    const pagina = (parseInt(req.query.page) - 1) * cantidadDatos;
    return res.json(data.splice(pagina, cantidadDatos));
  }

  if (req.query.keyword) {
    const data = await pool.query(`SELECT * FROM producto WHERE nombre_producto LIKE '%${req.query.keyword}%' ORDER BY nombre_producto ASC`);
    return res.json(data);
  }

  if (req.query.page) {
    const cantidadDatos = 12;
    const pagina = (parseInt(req.query.page) - 1) * cantidadDatos;
    const data = await pool.query("SELECT * FROM producto ORDER BY nombre_producto ASC");
    return res.json(data.splice(pagina, cantidadDatos));
  }

  const data = await pool.query("SELECT * FROM producto ORDER BY nombre_producto ASC");
  return res.json(data);
};

//.get("/:id")
ctrlProducto.getProducto = async (req, res) => {
  const data = await pool.query("SELECT * FROM producto WHERE id_producto = ?", [req.params.id]);
  return res.json(data[0]);
};

// .get("/count")
ctrlProducto.getCount = async (req, res) => {
  if (req.query.keyword) {
    const data = await pool.query(`SELECT COUNT(*) FROM producto WHERE nombre_producto LIKE '%${req.query.keyword}%'`);
    if (data[0]["COUNT(*)"]) return res.json(data[0]["COUNT(*)"]);
    return res.json(0);
  }
  const rows = await pool.query("SELECT COUNT(*) FROM producto");
  if (rows[0]["COUNT(*)"]) return res.json(rows[0]["COUNT(*)"]);
  return res.json(0);
};

// .post("/")
ctrlProducto.createProducto = async (req, res) => {
  const { nombre_producto, precio, cantidad_producto } = req.body;
  const newProduct = {
    nombre_producto,
    precio,
    cantidad_producto,
    url_foto_producto: "/uploads/fotosProducto/" + req.file.filename,
  };
  try {
    const data = await pool.query("INSERT INTO producto set ?", [newProduct]);
    if (data.affectedRows === 1) {
      newProduct.id_producto = data.insertId;
      return res.json({ success: "Producto creado correctamente", product: newProduct });
    }
  } catch (error) {
    if (error.code === "ECONNREFUSED") return res.json({ error: "Base de datos desconectada" });
    if (error.code === "ER_DUP_ENTRY") return res.json({ error: "Ya existe un producto con ese nombre" });
  }
  return res.json({ error: "Algo ocurrió mal" });
};

// .put("/:id")
ctrlProducto.actualizarProducto = async (req, res) => {
  const { nombre_producto, precio, cantidad_producto } = req.body;
  const newProduct = {
    id_producto: req.params.id,
    nombre_producto,
    precio,
    cantidad_producto,
  };
  try {
    if (req.file) {
      const producto = await pool.query("SELECT * FROM producto WHERE id_producto = ?", [req.params.id]);
      await fs.unlink(path.join(__dirname, "../build" + producto[0].url_foto_producto));
      newProduct.url_foto_producto = `/uploads/fotosProducto/${req.file.filename}`;
    }
    const rows = await pool.query("UPDATE producto set ? WHERE id_producto = ?", [newProduct, req.params.id]);
    if (rows.affectedRows === 1) return res.json({ success: "Producto actualizado", product: newProduct }); //Se logró actualizar
  } catch (error) {
    if (error.code === "ECONNREFUSED") return res.json({ error: "Base de datos desconectada" });
    if (error.code === "ER_DUP_ENTRY") return res.json({ error: "Ya existe un curso con ese nombre" });
  }
  return res.json({ error: "Ocurrió un error" });
};

// .delete("/:id")
ctrlProducto.deleteProducto = async (req, res) => {};

module.exports = ctrlProducto;
