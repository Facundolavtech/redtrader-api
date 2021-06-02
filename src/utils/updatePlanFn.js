const User = require("../models/User");
const resetCoupon = require("./resetCoupon");
const setExpireDate = require("./setExpireDate");

module.exports = async function (email, txn_id, plan_to_update) {
  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return { status: 404, msg: "No se encontro un usuario con ese mail" };
    }

    if (findUserByEmail.plan.active === true) {
      return { status: 400, msg: "El usuario ya tiene plan" };
    }

    let plan_type;

    switch (plan_to_update) {
      case "premium":
        plan_type = { premium: true, premium_plus: false };
        break;
      case "premium_plus":
        plan_type = { premium: false, premium_plus: true };
      default:
        break;
    }

    const plan = {
      active: true,
      plan_type,
      expire: setExpireDate(1), // 1 Month
      txn_id,
    };

    const discount = resetCoupon();

    await User.findByIdAndUpdate(findUserByEmail._id, {
      plan,
      first_month_payed: true,
      discount,
    });

    return { status: 200, msg: "Plan actualizado" };
  } catch (err) {
    return err;
  }
};
