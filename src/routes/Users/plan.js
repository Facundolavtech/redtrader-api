const { Router } = require("express");
const router = Router();

const { updatePlan } = require("../../controllers/users/updateplan.controller");

//ROUTE
// /api/users/plan

router.post("/update", updatePlan);

module.exports = router;
