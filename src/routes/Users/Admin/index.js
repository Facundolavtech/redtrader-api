const { Router } = require("express");
const router = Router();

const { adminMiddleware } = require("../../../middlewares/admin.middleware");

const {
  updatePlanAdmin,
  updateAdmin,
  updateEducator,
  deleteAccount,
} = require("../../../controllers/admin");
const { authMiddleware } = require("../../../middlewares/auth.middleware");

//ROUTE
// /api/admin/

router.put("/updatePlan", authMiddleware, adminMiddleware, updatePlanAdmin);
router.put("/updateAdmin", authMiddleware, adminMiddleware, updateAdmin);
router.put("/updateEducator", authMiddleware, adminMiddleware, updateEducator);
router.delete("/deleteAccount", authMiddleware, adminMiddleware, deleteAccount);

module.exports = router;
