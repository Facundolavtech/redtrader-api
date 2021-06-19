const { Router } = require("express");
const router = Router();

const { adminMiddleware } = require("../../../middlewares/admin.middleware");

const {
  updatePlanAdmin,
  updateAdmin,
  updateEducator,
  updatePartner,
  deleteAccount,
} = require("../../../controllers/admin");
const { authMiddleware } = require("../../../middlewares/auth.middleware");

//ROUTE
// /api/admin/

router.put("/updatePlan", authMiddleware, adminMiddleware, updatePlanAdmin);
router.put("/updateAdmin", authMiddleware, adminMiddleware, updateAdmin);
router.put("/updateEducator", authMiddleware, adminMiddleware, updateEducator);
router.put("/updatePartner", authMiddleware, adminMiddleware, updatePartner);
router.delete(
  "/deleteAccount/:email",
  authMiddleware,
  adminMiddleware,
  deleteAccount
);

module.exports = router;
