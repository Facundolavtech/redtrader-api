const User = require("../../models/User");
const { hash, compare } = require("bcrypt");
const generateToken = require("../../utils/generateToken");

exports.createUser = async function (req, res) {
  const values = req.body;

  const { password, email } = values;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(401).send("El correo electronico ya esta en uso");
    }

    const newUser = await new User(values);

    newUser.password = await hash(password, 10);

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

exports.loginUser = async function (req, res) {
  const data = req.body;

  try {
    const findUser = await User.findOne({ email: data.email });

    if (!findUser) {
      return res
        .status(404)
        .send("No se encontro un usuario registrado con esas credenciales");
    }

    const comparePasswords = await compare(data.password, findUser.password);

    if (!comparePasswords) {
      return res
        .status(401)
        .send("Datos incorrectos, comprueba tu correo o tu contraseña");
    }

    const tokenPayload = {
      id: findUser.id,
      email: findUser.email,
    };

    generateToken(tokenPayload).then((token) => {
      return res.status(200).json({ msg: "Logueado con exito", token });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.authUser = async function (req, res) {
  const id = req.user.id;

  try {
    const findUser = await User.findById(id).select("-password");

    if (!findUser) {
      return res.status(404).send("Ocurrio un error, inicia sesion nuevamente");
    }

    return res.status(200).json(findUser);
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.getUser = async function (req, res) {
  const id = req.params.id;

  try {
    const findUser = await User.findById(id);

    if (findUser) {
      return res.status(200).json(findUser);
    } else {
      return res.status(404).json({ msg: "No se encontro el usuario" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.updateUser = async function (req, res) {
  const id = req.params.id;
  const values = req.body;

  try {
    const findUser = await User.findById(id);
    if (findUser) {
      if (values.password) {
        values.password = await hash(values.password, 10);
      }
      await User.findByIdAndUpdate(id, values);

      return res.status(200).json({ msg: "Usuario actualizado" });
    } else {
      return res.status(404).json({ msg: "No se encontro el usuario" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.deleteUser = async function (req, res) {
  const id = req.params.id;

  try {
    const findUser = await User.findById(id);
    if (findUser) {
      await User.findByIdAndRemove(id);
      return res.status(200).json({ msg: "Usuario eliminado" });
    } else {
      return res.status(404).json({ msg: "No se encontro el usuario" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
