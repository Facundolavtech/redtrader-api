const User = require("../../models/User");

exports.getPartners = async function (req, res) {
  try {
    const partners = await User.find({ "roles.partner": true }).select(
      "name partner_stats email"
    );

    console.log(partners);

    return res.status(200).json(partners);
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
