const Signal = require("../../models/Signal");
const User = require("../../models/User");

exports.createSignal = async function (req, res) {
  try {
    const data = req.body;

    const newSignal = await new Signal(data);

    await newSignal.save();

    return res.status(200).json("Señal creada");
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.getSignals = async function (req, res) {
  try {
    const { id } = req.user;

    const findUserById = await User.findById(id);

    const signals = await Signal.find({}).sort({ createdAt: "desc" }).exec();

    if (!findUserById.plan.active) {
      return res
        .status(401)
        .json(
          "No tienes plan, adquiere uno para recibir las señales de RedTrade"
        );
    }

    if (!findUserById.plan.plan_type.premium_plus) {
      let filterSignals = signals.filter(
        (signal) => signal.market.value !== "acciones"
      );
      return res.status(200).json(filterSignals);
    }

    return res.status(200).json(signals);
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error", error });
  }
};
