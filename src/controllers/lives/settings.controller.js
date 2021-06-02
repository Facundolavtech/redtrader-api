const User = require("../../models/User");
const shortid = require("shortid");

exports.getStreamKey = async function (req, res) {
  const { id } = req.user;

  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json();
    }

    if (findUser.roles.educator === false) {
      return res.status(401).json();
    }

    const { stream_key } = findUser.educator_info;

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
      return res.status(404).json();
    }

    if (!findUser.roles.educator) {
      return res.status(401).json("No tienes permisos");
    }

    const stream_key = await shortid.generate();

    const educator_thumb = findUser.educator_info.educator_thumb;

    await User.findByIdAndUpdate(id, {
      educator_info: {
        stream_key,
        educator_thumb,
      },
    });

    return res.status(200).json(stream_key);
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.generateStreamPassword = async function (req, res) {
  const { id } = req.user;

  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json();
    }

    if (!findUser.roles.educator) {
      return res.status(401).json("No tienes permisos");
    }

    const stream_pw = await shortid.generate();

    await User.findByIdAndUpdate(id, { stream_pw });

    return res.status(200).json(stream_pw);
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
