const Educator = require("../../models/Educator");
const Partner = require("../../models/Partner");
const Plan = require("../../models/Plan");
const User = require("../../models/User");

exports.updatePlan = async function (req, res) {
  const { email, active, expireDate } = req.body;

  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res.status(404).json("No se encontro un usuario con ese correo");
    }

    if (active) {
      const findPlan = await Plan.findOne({ user: findUserByEmail._id });

      if (findPlan) {
        return res.status(400).json("El usuario ya tiene plan");
      }

      const plan = {
        user: findUserByEmail._id,
        type: "premium_plus",
        expires: expireDate,
      };

      const newPlan = await new Plan(plan);

      await newPlan.save();

      await User.findOneAndUpdate({ email }, { plan: newPlan._id });
    } else {
      await User.findOneAndUpdate({ email }, { plan: null });

      Plan.findOne({ user: findUserByEmail._id }, function (err, doc) {
        if (err) {
          return res.status(404).json("El usuario no tiene plan");
        }

        doc.remove();
      });
    }

    return res.status(200).json("Plan actualizado con exito");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.updateAdmin = async function (req, res) {
  const { email, active } = req.body;

  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res.status(404).json("No se encontro un usuario con ese correo");
    }

    if (active) {
      if (findUserByEmail.roles.includes("admin")) {
        return res.status(400).json("El usuario ya es admin");
      }
      await User.findOneAndUpdate({ email }, { $push: { roles: "admin" } });
    } else {
      await User.findOneAndUpdate({ email }, { $pull: { roles: "admin" } });
    }

    return res.status(200).json("Admin actualizado");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.deleteAccount = async function (req, res) {
  const { email } = req.params;

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
  try {
    const { email, active } = req.body;
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res.status(404).json("No se encontro un usuario con ese correo");
    }

    if (active) {
      if (findUserByEmail.roles.includes("educator")) {
        return res.status(400).json("El usuario ya es educador");
      }

      const findEducator = await Educator.findOne({
        user: findUserByEmail._id,
      });

      if (findEducator) {
        return res.status(400).json("El usuario ya es educador");
      }

      await User.findOneAndUpdate({ email }, { $push: { roles: "educator" } });
      const educator = {
        short_id: findUserByEmail.short_id,
        name: findUserByEmail.name,
        user: findUserByEmail._id,
      };

      const newEducator = await new Educator(educator);

      await newEducator.save();
    } else {
      await Educator.findOneAndRemove({ user: findUserByEmail._id });
      await User.findOneAndUpdate({ email }, { $pull: { roles: "educator" } });
    }
    return res.status(200).json("Educador actualizado");
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.updatePartner = async function (req, res) {
  try {
    const { email, active, special_discount } = req.body;

    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res
        .status(404)
        .json("No se encontro un usuario registrado con ese correo");
    }

    if (active) {
      if (findUserByEmail.roles.includes("partner")) {
        return res.status(400).json("El usuario ya es partner");
      }

      const findPartner = await Partner.findOne({ user: findUserByEmail._id });

      if (findPartner) {
        return res.status(400).json("El usuario ya tiene partner");
      }

      const partner = {
        user: findUserByEmail._id,
        name: findUserByEmail.name,
        email: findUserByEmail.email,
        special_discount,
      };

      const newPartner = await new Partner(partner);

      await newPartner.save();

      await User.findOneAndUpdate({ email }, { $push: { roles: "partner" } });
    } else {
      await User.findOneAndUpdate({ email }, { $pull: { roles: "partner" } });
      await Partner.findOneAndRemove({ user: findUserByEmail._id });
    }

    return res.status(200).json("Partner actualizado");
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
