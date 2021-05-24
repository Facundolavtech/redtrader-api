const shortid = require("shortid");
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
        {
          plan: {
            active: true,
            txn_id: null,
            expire: expireDate,
            plan_type: { premium: true, premium_plus: false },
          },
        }
      );
    } else {
      await User.findOneAndUpdate(
        { email },
        {
          plan: {
            active: false,
            expire: null,
            plan_type: {
              premium: false,
              premium_plus: false,
            },
            txn_id: null,
          },
        }
      );
    }

    return res.status(200).json("Plan actualizado con exito");
  } catch (error) {
    console.log(error);
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
      await User.findOneAndUpdate(
        { email },
        {
          roles: {
            admin: true,
            educator: findUserByEmail.roles.educator,
            user: findUserByEmail.roles.user,
          },
        }
      );
    } else {
      await User.findOneAndUpdate(
        { email },
        {
          roles: {
            admin: false,
            educator: findUserByEmail.roles.educator,
            user: findUserByEmail.roles.user,
          },
        }
      );
    }
    return res.status(200).json("Admin actualizado");
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
  const { email, active } = req.body;

  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res.status(404).json("No se encontro un usuario con ese correo");
    }

    let stream_key;

    if (active) stream_key = await shortid.generate();
    else stream_key = null;

    await User.findOneAndUpdate(
      { email },
      {
        roles: {
          educator: active,
          admin: findUserByEmail.roles.admin,
          user: findUserByEmail.roles.user,
        },
        plan: {
          active,
          plan_type: { premium: active, premium_plus: active },
          txn_id: null,
          expire: null,
        },
        educator_info: {
          stream_key,
        },
      }
    );

    return res.status(200).json("Educador actualizado");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};
