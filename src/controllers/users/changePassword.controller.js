const User = require("../../models/User");
const bcrypt = require("bcrypt");

exports.changePassword = async function (req, res) {
  const userId = req.user.id;
  const { newPassword, email } = req.body;

  try {
    const findUserById = await User.findById(userId);
    if (!findUserById) {
      return res.status(404).json("Ocurrio un error, intenta de nuevo");
    }

    if (findUserById.email !== email) {
      return res.status(401).json("Ocurrio un error, inicia sesion nuevamente");
    }

    await bcrypt
      .hash(newPassword, 10)
      .then(async (password) => {
        await User.findByIdAndUpdate(userId, { password });
        return res.status(200).json("Contraseña actualizada");
      })
      .catch(() => {
        return res.status(400).json("Ocurrio un error, intenta nuevamente");
      });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
