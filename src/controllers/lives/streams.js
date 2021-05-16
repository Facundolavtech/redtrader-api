const User = require("../../models/User");

exports.getStreams = async function (req, res) {
  try {
    const { id } = req.user;

    const findUser = await User.findById(id);

    if (!findUser) {
      return res.status(404).json("Inicia sesion para continuar");
    }

    if (!findUser.plan) {
      return res
        .status(401)
        .json("Necesitas un plan activo para acceder a las clases en vivo");
    }

    if (!req.query.streams) {
      return res
        .status(400)
        .json("No hay educadores conectados en este momento");
    }

    const streams = JSON.parse(req.query.streams);

    const lives = Object.keys(streams.live);

    const users = await User.find({
      stream_key: { $in: lives },
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
};
