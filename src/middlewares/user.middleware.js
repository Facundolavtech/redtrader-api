const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.checkUserIdentity = async function (req, res, next) {
  try {
    const getToken = req.header("Authorization");

    if (!getToken) {
      return res.status(401).json({ msg: "Inicia sesion para continuar" });
    }

    const hashToken = await jwt.verify(
      getToken,
      process.env.AUTH_USER_PRIVATE_KEY
    );

    if (req.params.id === hashToken.id) {
      req.user = { id: hashToken.id };
      next();
    } else {
      return res.status(401).json({ msg: "No tienes permiso para hacer esto" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.authMiddleware = async function (req, res, next) {
  try {
    const getToken = req.header("Authorization");

    if (!getToken) {
      return res.status(401).json({ msg: "Inicia sesion para continuar" });
    }

    const hashToken = await jwt.verify(
      getToken,
      process.env.AUTH_USER_PRIVATE_KEY
    );

    req.user = { id: hashToken.id };
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
