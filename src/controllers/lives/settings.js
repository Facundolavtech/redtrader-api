const User = require("../../models/User");
const shortid = require("shortid");

exports.getStreamKey = async function (req, res) {
  const { id } = req.user;

  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json("No se encontro el usuario");
    }

    if (!findUser.role_educator) {
      return res.status(401).json("No tienes permisos");
    }

    const { stream_key } = findUser;

    return res.status(200).json({ stream_key });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.generateStreamKey = async function (req, res) {
  const { id } = req.user;

  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json("No se encontro el usuario");
    }

    if (!findUser.role_educator) {
      return res.status(401).json("No tienes permisos");
    }

    const stream_key = await shortid.generate();

    await User.findByIdAndUpdate(id, { stream_key });

    return res.status(200).json({ stream_key });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
