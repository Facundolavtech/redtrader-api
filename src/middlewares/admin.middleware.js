const User = require("../models/User");

exports.checkAdmin = async function (req, res, next) {
  const userId = req.params.id;

  try {
    const findUserById = await User.findById(userId);

    if (!findUserById) {
      return res.status(404).send("No se encontro un usuario");
    }

    if (findUserById.isSuperAdmin === false) {
      return res.status(401).send("No tienes permisos para hacer esto");
    }

    req.id = userId;
    next();
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};
