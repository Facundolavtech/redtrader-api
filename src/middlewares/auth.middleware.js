const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = async function (req, res, next) {
  try {
    const authToken = req.header("Authorization");

    if (!authToken) {
      return res.status(401).json("Inicia sesion para continuar");
    }

    await jwt.verify(
      authToken,
      process.env.JWT_PRIVATE_KEY,
      (error, decoded) => {
        if (error) {
          return res
            .status(401)
            .json(
              "El token de autenticacion no es valido o expiró, porfavor inicia sesion nuevamente"
            );
        }
        req.user = { id: decoded.id };
        next();
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
