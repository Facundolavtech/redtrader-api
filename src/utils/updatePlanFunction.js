const User = require("../models/User");

module.exports = async function (email, txn_id) {
  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return { status: 404, msg: "No se encontro un usuario con ese mail" };
    }

    if (findUserByEmail.plan === true) {
      return { status: 401, msg: "El usuario ya tiene plan" };
    }

    let date = new Date();

    const plan_details = {
      expire: date.setDate(date.getDate() + 30),
      txn_id,
    };

    await User.findByIdAndUpdate(findUserByEmail._id, {
      plan: true,
      first_month: true,
      plan_details,
    });

    return { status: 200, msg: "Plan actualizado" };
  } catch (err) {
    return err;
  }
};
