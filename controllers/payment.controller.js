const { getDb } = require("../utils/dbConnect");

module.exports.getAllPayments = async (req, res) => {
  const db = getDb();
  try {
    const cursor = db.collection("Payments").find();
    const payments = await cursor.toArray();
    res.status(200).json({
      status: 200,
      message: "Successfully Got the payment data",
      data: payments,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Could not get the data",
      error: error.message,
    });
  }
};

module.exports.savePayment = async (req, res) => {
  const db = getDb();
  try {
    const details = req.body;
    details.price = parseInt(details?.price);
    details.language = details?.language.toUpperCase();
    details.date = new Date(details.date);
    const { insertedId } = await db.collection("Payments").insertOne(details);
    details._id = insertedId;
    res.status(200).send({
      status: 200,
      message: "Successfully inserted the payment data",
      data: details,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "Data can't be inserted",
      error: error.message,
    });
  }
};