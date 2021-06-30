const Educator = require("../../models/Educator");
const Transmission = require("../../models/Transmission");

exports.createTransmission = async function (req, res) {
  try {
    const { short_id } = req.params;

    const findEducator = await Educator.findOne({ short_id });

    if (!findEducator) {
      return res.status(404).json("No se encontro al educador");
    }

    const newTransmission = await new Transmission({
      educator: short_id,
      data: req.body,
    });

    await newTransmission.save();

    return res.status(200).json("Transmision guardada");
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.getTransmissions = async function (req, res) {
  try {
    const { short_id } = req.params;

    const findEducator = await Educator.findOne({ short_id });

    if (!findEducator) {
      return res
        .status(404)
        .json("No se encontraron transmisiones del educador");
    }

    const transmissions = await Transmission.find({
      educator: findEducator.short_id,
    });

    return res.status(200).json(transmissions);
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
