const multer = require("multer");
const path = require("path");
const multerCtrl = {};
// Settings

const storageFotosProductos = multer.diskStorage({
  destination: path.join(__dirname, "../build/uploads/fotosProducto"),
  filename: (req, file, cb) => {
    const fecha = new Date();
    cb(null, `${fecha.getDate()}-${fecha.getMonth()}-${fecha.getFullYear()}-${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}${file.originalname}`);
  },
});
const filterFotos = async (req, file, cb) => {
  const filetypes = /JPG|JPEG|jpg|jpeg|png|PNG/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname));
  // if (!req.user) return cb('Necesita una cuenta para esto');
  if (mimetype && extname) return cb(null, true);
  cb("Archivo debe ser una foto.");
};

multerCtrl.fotosProductos = multer({ storage: storageFotosProductos, fileFilter: filterFotos });

module.exports = multerCtrl;
