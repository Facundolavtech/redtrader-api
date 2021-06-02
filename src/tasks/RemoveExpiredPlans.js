const User = require("../models/User");

module.exports = async function () {
  try {
    let date = new Date();

    await User.updateMany(
      { "plan.expire": { $lte: date.setDate(date.getDate()) } },
      {
        $set: {
          plan: {
            active: false,
            txn_id: null,
            expire: null,
            plan_type: {
              premium: false,
              premium_plus: false,
            },
          },
        },
      }
    );
  } catch (error) {
    console.error("Error executing cron task: RemoveExpiredPlans", error);
  }
};
