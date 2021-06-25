const User = require("../models/User");

exports.partnerMiddleware = async function (req, res, next) {
  try {
    const { id } = req.user;

    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res
        .status(404)
        .json("Ocurrio un error inesperado, inicia sesion nuevamente");
    }

    if (!findUserById.roles.includes("partner")) {
      return res.status(401).json();
    }

    next();
  } catch (error) {
    return res.status(500).json();
  }
};
