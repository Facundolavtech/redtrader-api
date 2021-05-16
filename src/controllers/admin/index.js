const User = require("../../models/User");

exports.updatePlanAdmin = async function (req, res) {
  const { email, expireDate, active } = req.body;

  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res.status(404).json("No se encontro un usuario con ese correo");
    }

    if (active) {
      await User.findOneAndUpdate(
        { email },
        { plan: true, plan_details: { expire: expireDate } }
      );
    } else {
      await User.findOneAndUpdate(
        { email },
        { plan: false, plan_details: { expire: null, txn_id: null } }
      );
    }

    return res.status(200).json("Plan actualizado con exito");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.updateAdmin = async function (req, res) {
  const { email, add } = req.body;

  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res.status(404).json("No se encontro un usuario con ese correo");
    }

    if (add) {
      await User.findOneAndUpdate({ email }, { isSuperAdmin: true });
    } else {
      await User.findOneAndUpdate({ email }, { isSuperAdmin: false });
    }

    return res.status(200).json("Admin actualizado con exito");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.deleteAccount = async function (req, res) {
  const { email } = req.body;

  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res.status(404).json("No se encontro un usuario con ese correo");
    }

    await User.findOneAndRemove({ email });

    return res.status(200).json("Usuario eliminado con exito");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.updateEducator = async function (req, res) {
  const { email, role_educator } = req.body;

  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res.status(404).json("No se encontro un usuario con ese correo");
    }

    await User.findOneAndUpdate({ email }, { role_educator, plan: true });

    return res.status(200).json("Educador actualizado");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};
