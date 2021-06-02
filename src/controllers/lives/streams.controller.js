const User = require("../../models/User");

exports.getStreams = async function (req, res) {
  try {
    const { id } = req.user;

    const findUser = await User.findById(id);

    if (!findUser) {
      return res.status(404).json();
    }

    if (findUser.plan.active === false) {
      return res.status(401).json();
    }

    if (!req.query.streams) {
      return res.status(400).json();
    }

    const streams = JSON.parse(req.query.streams);

    const lives = Object.keys(streams);

    if (lives.includes("live")) {
      const livesList = Object.keys(streams.live);

      const users = await User.find({
        "educator_info.stream_key": {
          $in: livesList,
        },
      }).select(
        "-password -stream_pw -discount -roles -first_month_payed -plan -createdAt -updatedAt -confirmed -_id"
      );

      return res.status(200).json(users);
    } else {
      return res.status(200).json({ streams: [] });
    }
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
