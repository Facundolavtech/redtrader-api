const { Router } = require("express");
const {
  createUser,
  loginUser,
  authUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const {
  sendResetPasswordLink,
} = require("../controllers/users/forgotpassword");
const { updatePlan } = require("../controllers/users/updateplan");
const {
  checkUserIdentity,
  authMiddleware,
} = require("../middlewares/user.middleware");

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/auth", authMiddleware, authUser);
router.get("/:id", getUser);
router.put("/:id", checkUserIdentity, updateUser);
router.delete("/:id", checkUserIdentity, deleteUser);
router.post("/forgotpassword", sendResetPasswordLink);
router.post("/updateplan", updatePlan);

module.exports = router;
