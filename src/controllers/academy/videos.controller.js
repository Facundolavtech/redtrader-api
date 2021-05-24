const User = require("../../models/User");
const Video = require("../../models/Video");

exports.getVideos = async function (req, res) {
  try {
    const { id } = req.user;
    const findUser = await User.findById(id);

    if (!findUser) return res.status(404).send("Inicia sesion para continuar");

    const videoList = await Video.find({});

    if (findUser.plan.active === true) {
      const response = [...videoList];

      return res.status(200).json(response);
    } else {
      let filterVideoList = videoList;
      filterVideoList.map((video) => {
        if (video.unlocked) {
          return video;
        } else {
          video.src = null;
          return video;
        }
      });
      return res.status(200).json(filterVideoList);
    }
    return res.status(200).json(videoList);
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.createVideo = async function (req, res) {
  try {
    const data = req.body;

    const newVideo = await new Video(data);
    await newVideo.save();
    return res.status(200).json({ msg: "Video creado con exito" });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
