const { Router } = require("express");
const { getPartners } = require("../../controllers/users/partners.controller");
const { adminMiddleware } = require("../../middlewares/admin.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const router = Router();

//ROUTE
// /api/users/partners

router.get("/", authMiddleware, adminMiddleware, getPartners);

module.exports = router;
