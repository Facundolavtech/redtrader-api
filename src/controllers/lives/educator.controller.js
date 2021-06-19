const User = require("../../models/User");

exports.getEducatorInfo = async function (req, res) {
  try {
    const short_id = req.params.id;

    const selectData = "short_id name email educator_info roles.educator -_id";

    const findEducator = await User.findOne({ short_id }).select(selectData);

    if (!findEducator) {
      return res.status(404).json();
    }

    if (findEducator.roles.educator === false) {
      return res.status(400).json();
    }

    return res.status(200).json({ educator: findEducator });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.getEducators = async function (req, res) {
  try {
    const selectData = "short_id name email educator_info -_id";

    const educators = await User.find({ "roles.educator": true }).select(
      selectData
    );

    if (!educators) {
      return res.status(404).json();
    }

    return res.status(200).json(educators);
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
