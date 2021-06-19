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
            plan_type: { premium: true, premium_plus: true },
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

    let stream_key;
    let stream_pw;

    if (active) {
      stream_key = await shortid.generate();
      stream_pw = await shortid.generate();
    } else {
      stream_key = null;
      stream_pw = null;
    }

    const dataToUpdate = {
      roles: {
        educator: active,
        admin: findUserByEmail.roles.admin,
        user: findUserByEmail.roles.user,
      },
      plan: {
        active,
        plan_type: { premium: true, premium_plus: true },
        txn_id: null,
        expire: null,
      },
      educator_info: {
        stream_key,
        educator_thumb: "",
      },
      stream_pw,
    };

    await User.findOneAndUpdate({ email }, dataToUpdate);

    return res.status(200).json("Educador actualizado");
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.updatePartner = async function (req, res) {
  try {
    const { email, active } = req.body;

    let partnerID;
    let partner_stats;

    if (active) {
      partnerID = await shortid.generate();
      partner_stats = {
        registers: 0,
        pays: 0,
      };
    } else {
      partnerID = null;
      partner_stats = null;
    }

    const updateUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          "roles.partner": active,
          partnerID,
          partner_stats,
        },
      }
    );

    if (!updateUser) {
      return res.status(404).json("No se encontro un usuario con ese correo");
    }

    return res.status(200).json("Partner actualizado");
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
