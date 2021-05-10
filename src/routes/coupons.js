const { Router } = require("express");

const { checkAdmin } = require("../middlewares/admin.middleware");
const {
  createCoupon,
  applyCoupon,
  getAllCoupons,
  deleteCoupon,
} = require("../controllers/coupons");
const { authMiddleware } = require("../middlewares/user.middleware");

const router = Router();

router.post("/new/:id", checkAdmin, createCoupon);
router.delete("/deleteCoupon/:id/:couponId", checkAdmin, deleteCoupon);
router.post("/apply", authMiddleware, applyCoupon);
router.get("/getAllCoupons", authMiddleware, getAllCoupons);

module.exports = router;
