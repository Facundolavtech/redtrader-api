const { Router } = require("express");
const { authMiddleware } = require("../middlewares/user.middleware");
const { createPay } = require("../controllers/pays");

const router = Router();

router.post("/create", authMiddleware, createPay);

module.exports = router;
