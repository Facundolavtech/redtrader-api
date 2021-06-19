const User = require("../models/User");

module.exports = async function (partnerID) {
  const findPartnerById = await User.findOne({ partnerID });

  if (!findPartnerById) {
    return null;
  }

  if (!findPartnerById.roles.partner) {
    return null;
  }

  const registers = findPartnerById.partner_stats.registers;

  await User.findOneAndUpdate(
    { _id: findPartnerById._id },
    { $set: { "partner_stats.registers": registers + 1 } }
  );

  return {
    partner_name: findPartnerById.name,
    partnerID,
  };
};
