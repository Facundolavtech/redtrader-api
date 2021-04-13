const { Router } = require("express");
const User = require("../models/User");

const router = Router();

router.post("/hook", async (req, res) => {
  const { txn_id, email, status } = req.body;

  console.log(req.body, txn_id, email, status);

  if (status == 100) {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res.status(404).send("No se encontro un usuario con ese email");
    }

    await User.findByIdAndUpdate(findUserByEmail._id, { plan: true });

    return res.status(200).send("Plan actualizado con exito");
  }
});

module.exports = router;
