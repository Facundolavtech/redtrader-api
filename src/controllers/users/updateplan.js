const updatePlanFunction = require("../../utils/updatePlanFunction");

exports.updatePlan = async function (req, res) {
  const { email, txn_id } = req.body;

  try {
    const response = await updatePlanFunction(email, txn_id);

    return res.status(response.status).json({ msg: response.msg, email });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
