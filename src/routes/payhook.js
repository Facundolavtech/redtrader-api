const { Router } = require("express");
const updatePlanFunction = require("../utils/updatePlanFunction");

const router = Router();

router.post("/", async (req, res) => {
  const { txn_id, email, status } = req.body;

  console.log(req.body, txn_id, email, status);

  if (status == 100) {
    try {
      const response = await updatePlanFunction(email, txn_id);

      return res.status(response.status).send(response.msg);
    } catch (error) {
      return res.status(500).json({ msg: "Ocurrio un error", error });
    }
  }
});

module.exports = router;
