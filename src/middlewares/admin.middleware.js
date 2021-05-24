const User = require("../models/User");

exports.adminMiddleware = async function (req, res, next) {
  const { id } = req.user;

  try {
    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).json();
    }

    if (findUserById.roles.admin === false) {
      return res.status(401).send("No tienes permisos para hacer esto");
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Ocurrio un error");
  }
};
