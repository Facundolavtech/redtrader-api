const Signal = require("../../models/Signal");
const User = require("../../models/User");
const Plan = require("../../models/Plan");

exports.createSignal = async function (req, res) {
  try {
    const data = req.body;

    const newSignal = await new Signal({ data: { ...data } });

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

    if (!findUserById.plan) {
      return res
        .status(401)
        .json(
          "No tienes plan, adquiere uno para recibir las señales de RedTrade"
        );
    } else {
      const signals = await Signal.find({}).sort({ createdAt: "desc" }).exec();

      const findPlan = await Plan.findById(findUserById.plan);

      if (!findPlan.type !== "premium_plus") {
        let filterSignals = signals.filter(
          ({ data }) => data.market.value !== "acciones"
        );
        return res.status(200).json(filterSignals);
      }

      return res.status(200).json(signals);
    }
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error", error });
  }
};
