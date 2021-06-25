const Plan = require("../models/Plan");
const User = require("../models/User");

module.exports = async function () {
  try {
    let date = new Date();

    const expiredPlans = await Plan.find(
      {
        expires: { $lte: date.setDate(date.getDate()) },
      },
      async function (err, docs) {
        if (err) return;
        docs.forEach(function (doc) {
          doc.remove();
        });
      }
    );

    for (let expiredPlan of expiredPlans) {
      await User.findOne({ _id: expiredPlan.user }, function (err, doc) {
        if (err) return;
        if (doc) {
          doc.plan = null;
          doc.save();
        }
      });
    }

    return;
  } catch (error) {
    console.error("Error executing cron task: RemoveExpiredPlans", error);
  }
};
