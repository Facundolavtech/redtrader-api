const { Router } = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { createPayment } = require("../controllers/payments");
const updatePlanFn = require("../utils/updatePlanFn");

const router = Router();

//ROUTE
// api/payments/

router.post("/create", authMiddleware, createPayment);
router.post("/hook", async (req, res) => {
  const { txn_id, email, status } = req.body;

  console.info(`New payment status: TXN: ${txn_id}, Status: ${status}`);

  if (status == 100) {
    try {
      await updatePlanFn(email, txn_id).then((res) => {
        if (res.status !== 200) {
          return console.error("Error in payment: ", txn_id, email, res.msg);
        } else {
          return console.info("Successfully payment: ", txn_id, email);
        }
      });
    } catch (error) {
      return console.error("Payhook error: ", error);
    }
  }
});

module.exports = router;
