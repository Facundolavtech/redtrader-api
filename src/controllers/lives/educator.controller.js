const Educator = require("../../models/Educator");
const User = require("../../models/User");

exports.getEducatorInfo = async function (req, res) {
  try {
    const short_id = req.params.id;

    const selectData = "short_id name roles stream_key thumbnail -_id ";

    const findEducator = await Educator.findOne({ short_id }).select(
      selectData
    );

    if (!findEducator) {
      return res.status(404).json();
    }

    return res.status(200).json({ educator: findEducator });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.getEducators = async function (req, res) {
  try {
    const selectData = "short_id name stream_key thumbnail schedules -_id";

    const educators = await Educator.find({}).select(selectData);

    if (!educators) {
      return res.status(404).json();
    }

    return res.status(200).json(educators);
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
