const { Router } = require("express");
const {
  getPartners,
  getPartnerInfo,
} = require("../../controllers/users/partners.controller");
const { adminMiddleware } = require("../../middlewares/admin.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { partnerMiddleware } = require("../../middlewares/partner.middleware");
const router = Router();

//ROUTE
// /api/users/partners

router.get("/", authMiddleware, adminMiddleware, getPartners);
router.get("/info", authMiddleware, partnerMiddleware, getPartnerInfo);

module.exports = router;
