const User = require("../models/User");
const setExpireDate = require("./setExpireDate");

module.exports = async function (email, txn_id) {
  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return { status: 404, msg: "No se encontro un usuario con ese mail" };
    }

    if (findUserByEmail.plan.active === true) {
      return { status: 400, msg: "El usuario ya tiene plan" };
    }

    const plan = {
      active: true,
      plan_type: { premium: true },
      expire: setExpireDate(1), // 1 Month
      txn_id,
    };

    await User.findByIdAndUpdate(findUserByEmail._id, {
      plan,
      first_month_payed: true,
    });

    return { status: 200, msg: "Plan actualizado" };
  } catch (err) {
    return err;
  }
};
