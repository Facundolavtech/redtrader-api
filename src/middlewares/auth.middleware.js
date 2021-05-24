const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = async function (req, res, next) {
  try {
    const authToken = req.header("Authorization");

    if (!authToken) {
      return res.status(401).json({ msg: "Inicia sesion para continuar" });
    }

    const decodeToken = await jwt.verify(
      authToken,
      process.env.JWT_PRIVATE_KEY
    );

    req.user = { id: decodeToken.id };
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
