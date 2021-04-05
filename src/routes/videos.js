const { Router } = require("express");
const { getVideos, createVideo } = require("../controllers/academy/videoList");
const { authMiddleware } = require("../middlewares/user.middleware");

const router = Router();

router.get("/", authMiddleware, getVideos);
router.post("/", authMiddleware, createVideo);

module.exports = router;
