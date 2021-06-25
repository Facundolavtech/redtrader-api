const User = require("../../models/User");
const Plan = require("../../models/Plan");
const { hash, compare } = require("bcrypt");
const generateToken = require("../../utils/generateToken");
const updateReferred = require("../../utils/updateReferred");

exports.register = async function (req, res) {
  try {
    const { password, email, name } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(401).send("El correo electronico ya esta en uso");
    }

    const newUser = await new User({ email, password, name });

    newUser.password = await hash(password, 10);

    if (req.body.partner_link) {
      newUser.referred = await updateReferred(req.body.partner_link);
    }

    await newUser.save().then(() => {
      const tokenPayload = {
        id: newUser.id,
        email: newUser.email,
      };

      generateToken(tokenPayload).then((token) => {
        return res.status(200).json({ msg: "Registrado con exito", token });
      });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.login = async function (req, res) {
  const data = req.body;

  const { email } = data;

  try {
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res
        .status(404)
        .json("No se encontro un usuario registrado con esas credenciales");
    }

    const comparePasswords = await compare(data.password, findUser.password);

    if (!comparePasswords) {
      return res
        .status(401)
        .json("Datos incorrectos, comprueba tu correo o tu contraseña");
    }

    const tokenPayload = {
      id: findUser.id,
      email: findUser.email,
    };

    generateToken(tokenPayload).then((token) => {
      return res.status(200).json({ token });
    });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.auth = async function (req, res) {
  const id = req.user.id;

  try {
    const findUser = await User.findById(id).select("-password");

    if (!findUser) {
      return res.status(404).json();
    }

    let plan;

    if (findUser.plan) {
      plan = await Plan.findOne({ user: findUser._id });
      return res.status(200).json({ user: findUser, plan });
    }

    return res.status(200).json({ user: findUser, plan: null });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
