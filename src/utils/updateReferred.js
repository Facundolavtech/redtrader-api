const Partner = require("../models/Partner");

module.exports = async function (link) {
  const findPartner = await Partner.findOne({ link });

  if (!findPartner) {
    return null;
  }

  const registers = findPartner.stats.registers;

  await Partner.findOneAndUpdate(
    { _id: findPartner._id },
    { $set: { "stats.registers": registers + 1 } }
  );

  return {
    partner_name: findPartner.name,
    partnerID: findPartner._id,
    special_discount: findPartner.special_discount,
  };
};
