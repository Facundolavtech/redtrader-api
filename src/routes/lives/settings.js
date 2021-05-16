const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/user.middleware");
const {
  generateStreamKey,
  getStreamKey,
} = require("../../controllers/lives/settings");

const router = Router();

router.get("/stream_key", authMiddleware, getStreamKey);

router.post("/stream_key", authMiddleware, generateStreamKey);

module.exports = router;
