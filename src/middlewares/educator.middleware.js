const User = require("../models/User");

exports.educatorMiddleware = async function (req, res, next) {
  try {
    const { id } = req.user;

    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res
        .status(404)
        .json("Ocurrio un error inesperado, inicia sesion nuevamente");
    }

    if (!findUserById.roles.educator) {
      return res
        .status(401)
        .json("No tienes permisos para realizar esta accion");
    }

    next();
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
