const Partner = require("../models/Partner");
const setExpireDate = require("../utils/setExpireDate");

module.exports = async function () {
  try {
    let date = new Date();

    await Partner.find(
      {
        next_reset: { $lte: date.setDate(date.getDate()) },
      },
      async function (err, docs) {
        if (err) return;
        docs.forEach(function (doc) {
          doc.stats = { registers: 0, pays: 0 };
          doc.next_reset = setExpireDate(1);
          doc.save();
        });
      }
    );

    return;
  } catch (error) {
    console.error("Error executing cron task: RemoveExpiredPlans", error);
  }
};
