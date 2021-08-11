const pool = require("../database");
const ctrlUsuario = {};

//.get("/")
ctrlUsuario.getUsuarios = async (req, res) => {};

//.get("/:id")
ctrlUsuario.getUsuario = async (req, res) => {};

// .get("/count")
ctrlUsuario.getCount = async (req, res) => {};

// .get("/whoami")
ctrlUsuario.whoami = async (req, res) => {
  if (!req.user) return res.json({ error: "No autentificado" }); //No autentificado
  const usuario = await pool.query(`SELECT * FROM usuario WHERE id_usuario = ? `, [req.user.id_usuario]);
  const sendUser = {
    id_usuario: usuario[0].id_usuario,
    birthday: usuario[0].fecha_nacimiento,
    documentNumber: usuario[0].documento,
    documentType: usuario[0].id_tipo_documento,
    email: usuario[0].correo_usuario,
    gender: usuario[0].id_sexo,
    name: usuario[0].nombre_usuario,
    phone: usuario[0].telefono,
    surname: usuario[0].apellido_usuario,
    authenticate: true,
    id_rango: usuario[0].id_rango,
  };
  return res.json({ user: sendUser });
};

// .post("/")
ctrlUsuario.createUsuario = async (req, res) => {};

// .put("/:id")
ctrlUsuario.actualizarUsuario = async (req, res) => {
  const { name, surname, email, documentNumber, documentType, phone, birthday, gender } = req.body;
  const newUser = {
    nombre_usuario: name,
    apellido_usuario: surname,
    correo_usuario: email,
    telefono: phone,
    documento: documentNumber,
    fecha_nacimiento: birthday,
    id_tipo_documento: documentType,
    id_sexo: gender,
  };
  try {
    const data = await pool.query("UPDATE usuario set ? WHERE id_usuario", [newUser, req.params.id]);
    newUser.id_usuario = req.params.id;
    newUser.authenticate = true;
    if (data.affectedRows === 1) return res.json({ success: "Datos actualizados", user: newUser }); //Se logró actualizar
} catch (error) {
  if (error.code === "ECONNREFUSED") return res.json({ error: "Base de datos desconectada" });
  if (error.code === "ER_DUP_ENTRY") return res.json({ error: "Ya está en uso ese correo" });
}
};

// .delete("/:id")
ctrlUsuario.deleteUsuario = async (req, res) => {};

module.exports = ctrlUsuario;
