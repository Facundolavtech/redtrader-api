const Partner = require("../../models/Partner");

exports.getPartners = async function (req, res) {
  try {
    const partners = await Partner.find({})
      .sort({ createdAt: "desc" })
      .select("special_discount _id name email stats");

    return res.status(200).json(partners);
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.getPartnerInfo = async function (req, res) {
  try {
    const { id } = req.user;

    const findPartner = await Partner.findOne({ user: id });

    if (!findPartner) return res.status(404).json();

    return res.status(200).json(findPartner);
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
