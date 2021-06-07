const { Router } = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { createPayment } = require("../controllers/payments");
const updatePlanFn = require("../utils/updatePlanFn");

const router = Router();

//ROUTE
// api/payments/

router.post("/create", authMiddleware, createPayment);
router.post("/hook/:plan", async (req, res) => {
  const { txn_id, email, status } = req.body;

  const { plan } = req.params;

  console.info(`New payment status: TXN: ${txn_id}, Status: ${status}`);

  if (status == 100) {
    try {
      await updatePlanFn(email, txn_id, plan).then((res) => {
        if (res.status !== 200) {
          console.error("Error in payment: ", txn_id, email, res.msg);
        } else {
          console.info("Successfully payment: ", txn_id, email);
        }
      });
      return res.status(200).json();
    } catch (error) {
      console.error("Payhook error: ", error);
      return res.status(500).json();
    }
  } else {
    return res.status(202).json();
  }
});

module.exports = router;
