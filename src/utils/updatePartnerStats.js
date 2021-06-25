const Partner = require("../models/Partner");

module.exports = async function (user) {
  if (!user.first_month_payed && user.referred !== null) {
    const findPartner = await Partner.findById(user.referred.partnerID);

    if (!findPartner) {
      return;
    } else {
      const updatedPays = findPartner.stats.pays + 1;

      await Partner.findOneAndUpdate(
        { _id: findPartner._id },
        { $set: { "stats.pays": updatedPays } }
      );
    }

    return;
  } else {
    return;
  }
};
