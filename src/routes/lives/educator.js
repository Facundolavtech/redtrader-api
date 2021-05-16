const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/user.middleware");
const { getEducatorInfo } = require("../../controllers/lives/educator");

const router = Router();

router.get("/info/:id", authMiddleware, getEducatorInfo);

module.exports = router;
