const User = require("../../models/User");
const ForgotPwToken = require("../../models/ForgotPasswordToken");
const bcrypt = require("bcrypt");

exports.resetPassword = async function (req, res) {
  const { id, token, password } = req.body;

  try {
    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).send("No se encontro un usuario");
    }

    const findToken = await ForgotPwToken.findOne({ token });

    if (!findToken) {
      return res
        .status(404)
        .send(
          "El token para cambiar la contraseña no existe o expiro, porfavor vuelve a generar otro"
        );
    }

    if (findToken.userId != id) {
      return res
        .status(401)
        .send(
          "El token para cambiar contraseña es invalido, intenta generando uno nuevo"
        );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(id, { password: hashPassword });

    return res.status(200).send("Contraseña cambiada con exito");
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
