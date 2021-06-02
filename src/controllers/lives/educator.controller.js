const User = require("../../models/User");

exports.getEducatorInfo = async function (req, res) {
  try {
    const short_id = req.params.id;

    const selectData =
      "-password -plan -stream_pw -confirmed -first_month_payed -createdAt -updatedAt -discount -roles.user -roles.admin -_id";

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
