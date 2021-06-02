const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const {
  generateStreamKey,
  getStreamKey,
  generateStreamPassword,
} = require("../../controllers/lives/settings.controller");

const router = Router();

//ROUTE
// api/educator/settings

router.get("/stream_key", authMiddleware, getStreamKey);

router.post("/stream_key", authMiddleware, generateStreamKey);
router.post("/stream_pw", authMiddleware, generateStreamPassword);

module.exports = router;
