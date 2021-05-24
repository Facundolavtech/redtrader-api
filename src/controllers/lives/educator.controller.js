const User = require("../../models/User");

exports.getEducatorInfo = async function (req, res) {
  try {
    const short_id = req.params.id;

    const selectData =
      "-password -plan -confirmed -first_month_payed -createdAt -updatedAt -discount -roles.user -roles.admin -educator_info.stream_key -_id";

    const findEducator = await User.findOne({ short_id }).select(selectData);

    if (!findEducator) {
      return res.status(404);
    }

    if (findEducator.roles.educator === false) {
      return res.status(400);
    }

    return res.status(200).json({ educator: findEducator });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
