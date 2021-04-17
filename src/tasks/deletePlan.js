const User = require("../models/User");

module.exports = async function () {
  try {
    let date = new Date().toISOString();

    await User.updateMany(
      { "plan_details.expire": { $lte: date } },
      {
        $set: {
          plan: false,
          plan_details: { expire: undefined, txn_id: undefined },
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};
