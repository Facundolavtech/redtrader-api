const User = require("../../models/User");
const Video = require("../../models/Video");

exports.getVideos = async function (req, res) {
  const id = req.user.id;
  try {
    const findUser = await User.findById(id);
    const videoList = await Video.find({});

    if (!findUser) return res.status(404).send("Inicia sesion para continuar");
    else {
      if (findUser.plan === true) {
        const response = [...videoList];

        return res.status(200).json(response);
      } else {
        let videoListMap = videoList;
        videoListMap = videoListMap.map((video) => {
          if (video.openToFreeUsers) {
            return video;
          } else {
            video.src = null;
            return video;
          }
        });
        return res.status(200).json(videoListMap);
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.createVideo = async function (req, res) {
  const id = req.user.id;
  const videoData = req.body;
  try {
    const findUser = await User.findOne({ _id: id });

    if (!findUser.isSuperAdmin) {
      return res
        .status(401)
        .json({ msg: "No tienes permisos para hacer esto" });
    }

    const newVideo = await new Video(videoData);
    await newVideo.save();
    return res.status(200).json({ msg: "Video creado con exito" });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
