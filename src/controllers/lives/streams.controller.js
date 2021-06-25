const User = require("../../models/User");
const Educator = require("../../models/Educator");

exports.getStreams = async function (req, res) {
  try {
    const { id } = req.user;

    const findUser = await User.findById(id);

    if (!findUser) {
      return res.status(404).json();
    }

    if (typeof findUser.plan === "undefined" || !findUser.plan) {
      return res
        .status(401)
        .json("Necesitas un plan para acceder a RedTrader live");
    }

    if (!req.query.streams) {
      return res.status(400).json();
    }

    const streams = JSON.parse(req.query.streams);

    const lives = Object.keys(streams);

    if (lives.includes("live")) {
      const livesList = Object.keys(streams.live);

      const online_educators = await Educator.find({
        stream_key: {
          $in: livesList,
        },
      }).select("name stream_key short_id thumbnail schedules user -_id");

      return res.status(200).json(online_educators);
    } else {
      return res.status(200).json({ streams: [] });
    }
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
