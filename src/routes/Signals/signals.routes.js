const { Router } = require("express");
const {
  createSignal,
  getSignals,
  updateSignal,
  deleteSignal,
} = require("../../controllers/signals/signals.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { educatorMiddleware } = require("../../middlewares/educator.middleware");

const router = Router();

//ROUTE
// /api/signals/

router.post("/create", authMiddleware, educatorMiddleware, createSignal);
router.get("/", authMiddleware, getSignals);
router.put("/update/:id", authMiddleware, educatorMiddleware, updateSignal);
router.delete("/delete/:id", authMiddleware, educatorMiddleware, deleteSignal);

module.exports = router;
