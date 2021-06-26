const User = require("../../models/User");
const shortid = require("shortid");
const Educator = require("../../models/Educator");

exports.getCredentials = async function (req, res) {
  const { id } = req.user;

  try {
    const findUser = await User.findById(id);

    const findEducator = await Educator.findOne({ user: findUser._id });

    if (!findEducator) return res.status(404).json();

    const { stream_key, stream_pw } = findEducator;

    return res.status(200).json({ stream_key, stream_pw });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.generateStreamKey = async function (req, res) {
  const { id } = req.user;

  try {
    const findUser = await User.findById(id);

    await Educator.findOne({ user: findUser._id }, async function (err, doc) {
      if (err) return res.status(400).json();

      doc.stream_key = await shortid.generate();

      await doc.save();
      return res.status(200).json(doc.stream_key);
    });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.generateStreamPassword = async function (req, res) {
  const { id } = req.user;

  try {
    const findUser = await User.findById(id);

    await Educator.findOne({ user: findUser._id }, async function (err, doc) {
      if (err) return res.status(400).json();

      doc.stream_pw = await shortid.generate();

      await doc.save();
      return res.status(200).json(doc.stream_pw);
    });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
