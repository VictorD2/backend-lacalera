const pool = require("../database");
const helpers = require("./helpers");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//Configuración de passport al iniciar sesion
passport.use("local.signin",  new LocalStrategy(    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    }, async (req, email, password, done) => {
      const rows = await pool.query(`SELECT * FROM usuario WHERE correo_usuario = ?`, [email]);
      if (!rows.length > 0) return done("Ese correo no está registrado" , false, { message: "Ese correo no está registrado" }); //El usuario no existe

      const validPassword = await helpers.matchPassword(password, rows[0].password); //<- Verificando la contraseña
      delete rows[0].password;
      const sendUser = {
        id_usuario: rows[0].id_usuario,
        birthday: rows[0].fecha_nacimiento,
        documentNumber: rows[0].documento,
        documentType: rows[0].id_tipo_documento,
        email: rows[0].correo_usuario,
        gender: rows[0].id_sexo,
        name: rows[0].nombre_usuario,
        phone: rows[0].telefono,
        surname: rows[0].apellido_usuario,
        authenticate: true,
        id_rango: rows[0].id_rango,
      };
      if (validPassword) return done(null, sendUser); //<- Contraseña correcta

      done("Contraseña inválida", false, { message: "Contraseña inválida" }); //<-Contraseña incorrecta
    }
  )
);

//Configuración de passport al registrarse
passport.use("local.signup",  new LocalStrategy({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    }, async (req, user, pass, done) => {
      const { name, surname, email, password, documentNumber, documentType, phone, birthday, gender } = req.body;
      const newUser = {
        nombre_usuario: name,
        apellido_usuario: surname,
        id_rango: 1,
        correo_usuario: email,
        telefono:phone,
        documento:documentNumber,
        fecha_nacimiento:birthday,
        password,
        id_tipo_documento: documentType,
        id_sexo:gender
      };
      newUser.password = await helpers.encrypPassword(newUser.password); //<- Encripta la contraseña
      try {
        const data = await pool.query("INSERT INTO usuario set ?", [newUser]);
        delete newUser.password;
        newUser.id_usuario = data.insertId;
        return done(null, newUser);
      } catch (error) {
        return done("El correo ya está en uso", false, { error: "El correo ya está en uso" });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});
