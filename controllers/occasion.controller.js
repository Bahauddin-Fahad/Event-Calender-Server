const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

module.exports.getAllOccasions = async (req, res) => {
  const db = getDb();
  const userId = req.params.userId;
  const filter = { user_id: userId };

  try {
    const cursor = db.collection("Occasions").find(filter).sort({ date: -1 });
    const occassions = await cursor.toArray();
    res.status(200).json({
      status: 200,
      message: "Successfully Got the Occasions data",
      data: occassions,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Could not get the Occassions data",
      error: error.message,
    });
  }
};

module.exports.createOccasion = async (req, res) => {
  const db = getDb();
  try {
    const details = req.body;
    const { insertedId } = await db.collection("Occasions").insertOne(details);
    details._id = insertedId;
    res.status(200).send({
      status: 200,
      message: "Successfully inserted the Occasion data",
      data: details,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "Failed to Add Occasion Data",
      error: error.message,
    });
  }
};

module.exports.editOccasion = async (req, res) => {
  const db = getDb();
  try {
    const occassionId = req.params.id;
    const occasionData = req.body;
    const filter = { _id: ObjectId(occassionId) };
    const options = { upsert: true };
    const updatedDoc = {
      $set: {
        occasionData,
      },
    };
    const result = await db
      .collection("Occasions")
      .updateOne(filter, updatedDoc, options);
    res.status(200).send({
      status: 200,
      message: "Successfully edited the occasion data",
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "Failed to Edit Data",
      error: error.message,
    });
  }
};

module.exports.deleteOccasion = async (req, res) => {
  const db = getDb();
  try {
    const occassionId = req.params.id;
    const query = { _id: ObjectId(occassionId) };

    const result = await db.collection("Occasions").deleteOne(query);
    res.status(200).send({
      status: 200,
      message: "Successfully deleted the occasion data",
      data: result,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "Failed to Delete Data",
      error: error.message,
    });
  }
};
