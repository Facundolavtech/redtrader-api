const { Router } = require("express");
const {
  getTransmissions,
  createTransmission,
} = require("../../controllers/lives/transmissions.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { adminMiddleware } = require("../../middlewares/admin.middleware");

const router = Router();

//ROUTE
// api/lives/transmissions

router.post(
  "/new/:short_id",
  authMiddleware,
  adminMiddleware,
  createTransmission
);
router.get("/:short_id", authMiddleware, getTransmissions);

module.exports = router;
