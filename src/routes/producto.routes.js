const router = require("express").Router();
const ctrlProducto = require("../controllers/Producto.controllers");
const upload = require('../lib/multer');

router.get("/", ctrlProducto.getProductos);
router.get("/count", ctrlProducto.getCount);
router.get("/:id", ctrlProducto.getProducto);
router.post("/",function(req, res, next) {
    upload.fotosProductos.single('photo')(req, res, function(err) {
        if (err) return res.json({ error: err }); // A Multer error occurred when uploading.
        next();
    })
}, ctrlProducto.createProducto);
router.put("/:id",function(req, res, next) {
    upload.fotosProductos.single('photo')(req, res, function(err) {
        if (err) return res.json({ error: err }); // A Multer error occurred when uploading.
        next();
    })
}, ctrlProducto.actualizarProducto);
router.delete("/:id", ctrlProducto.deleteProducto);

module.exports = router;
