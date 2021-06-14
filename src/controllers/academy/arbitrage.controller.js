const User = require("../../models/User");
const ArbitrageVideo = require("../../models/Arbitrage_Video");

exports.getArbitrageVideos = async function (req, res) {
  try {
    const { id } = req.user;
    const { level } = req.params;
    const findUser = await User.findById(id);

    if (!findUser) return res.status(404).send("Inicia sesion para continuar");

    const videos = await ArbitrageVideo.find({ level });

    if (!findUser.plan.active || !findUser.plan.plan_type.premium_plus) {
      return res
        .status(401)
        .json(
          "Necesitas el plan Premium Plus para acceder a la academia de arbitrage"
        );
    }

    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.createArbitrageVideos = async function (req, res) {
  try {
    const data = req.body;

    const newVideo = await new ArbitrageVideo(data);
    await newVideo.save();
    return res.status(200).json({ msg: "Video creado con exito" });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
