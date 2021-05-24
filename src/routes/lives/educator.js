const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const {
  getEducatorInfo,
} = require("../../controllers/lives/educator.controller");

const router = Router();

//ROUTE
// /api/lives/educator

router.get("/info/:id", authMiddleware, getEducatorInfo);

module.exports = router;
