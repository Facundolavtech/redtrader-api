const { Router } = require("express");
const { adminMiddleware } = require("../middlewares/admin.middleware");
const {
  createCoupon,
  applyCoupon,
  getCoupons,
  deleteCoupon,
} = require("../controllers/coupons");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = Router();

//ROUTE
// api/coupons/

//Admin Routes
router.post("/new", authMiddleware, adminMiddleware, createCoupon);
router.delete(
  "/deleteCoupon/:couponId",
  authMiddleware,
  adminMiddleware,
  deleteCoupon
);
router.get("/getAllCoupons", authMiddleware, adminMiddleware, getCoupons);

//User Route
router.post("/apply", authMiddleware, applyCoupon);

module.exports = router;
