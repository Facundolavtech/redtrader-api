const { Router } = require("express");
const {
  getVideos,
  createVideo,
} = require("../controllers/academy/videos.controller");
const {
  createArbitrageVideos,
  getArbitrageVideos,
} = require("../controllers/academy/arbitrage.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");

const router = Router();

//ROUTE
// api/videos/
router.get("/", authMiddleware, getVideos);
router.post("/", authMiddleware, adminMiddleware, createVideo);

//Arbitrage
router.get("/arbitrage/:level", authMiddleware, getArbitrageVideos);
router.post(
  "/arbitrage",
  authMiddleware,
  adminMiddleware,
  createArbitrageVideos
);

module.exports = router;
