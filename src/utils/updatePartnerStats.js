const User = require("../models/User");

module.exports = async function (user) {
  if (!user.first_month_payed && user.referred !== null) {
    const doc = await User.findOne({
      partnerID: user.referred.partnerID,
    });

    if (doc) {
      const pays = doc.partner_stats.pays;

      await User.updateOne(
        { partnerID: user.referred.partnerID },
        { $set: { "partner_stats.pays": pays + 1 } }
      );

      return;
    } else return;
  }
  return;
};
