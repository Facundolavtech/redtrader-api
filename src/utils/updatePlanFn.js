const Plan = require("../models/Plan");
const User = require("../models/User");
const setExpireDate = require("./setExpireDate");
const updatePartnerStats = require("./updatePartnerStats");

module.exports = async function (email, plan_type) {
  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return { status: 404, msg: "No se encontro un usuario con ese mail" };
    }

    await Plan.findOne(
      { user: findUserByEmail._id },
      async function (err, doc) {
        if (err) return { status: 400, msg: "Ocurrio un error inesperado" };

        if (!doc) {
          const plan = {
            user: findUserByEmail._id,
            type: plan_type,
            expires: setExpireDate(1),
          };

          const newPlan = await new Plan(plan);

          await newPlan.save();

          await User.updateOne(
            { _id: findUserByEmail._id },
            { plan: newPlan._id, first_month_payed: true }
          );
        } else {
          doc.type = plan_type;
          doc.expires = setExpireDate(1); //1 Month

          doc.save();

          await User.updateOne(
            { _id: findUserByEmail._id },
            { first_month_payed: true }
          );
        }
      }
    );

    await updatePartnerStats(findUserByEmail);

    if (findUserByEmail.coupon !== null) {
      await User.updateOne({ _id: findUserByEmail._id }, { coupon: null });
    }

    return { status: 200, msg: "Plan actualizado" };
  } catch (err) {
    return err;
  }
};
