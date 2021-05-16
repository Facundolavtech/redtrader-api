const User = require("../../models/User");

exports.getEducatorInfo = async function (req, res) {
  try {
    const short_id = req.params.id;

    const selectData =
      "-password -plan -confirmed -first_month -createdAt -updatedAt -isSuperAdmin -discount";

    const findEducator = await await User.findOne({ short_id }).select(
      selectData
    );

    if (!findEducator) {
      return res.status(404).json("No se encontro al educador");
    }

    if (!findEducator.role_educator) {
      return res.status(400).json("El usuario no es educador");
    }

    return res.status(200).json({ educator: findEducator });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
