const { ObjectId } = require("mongodb");
const { getDb } = require("../../utils/dbConnect");

module.exports.getAllPromotionData = async (req, res) => {
  const db = getDb();
  let queries = {};
  try {
    const cursor = db.collection("Promotions").find(queries).sort({ date: -1 });
    const promotionData = await cursor.toArray();
    res.status(200).json({
      status: 200,
      message: "Successfully Got the Bhakti Promotion data",
      data: promotionData,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Could not get the data",
      error: error.message,
    });
  }
};
module.exports.addPromotionData = async (req, res) => {
  const db = getDb();
  try {
    const details = req.body;
    const { insertedId } = await db.collection("Promotions").insertOne(details);
    details._id = insertedId;
    res.status(200).send({
      status: 200,
      message: "Successfully inserted the Bhakti Promotion data",
      data: details,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "Failed to Add Bhakti Promotions Data",
      error: error.message,
    });
  }
};
module.exports.editPromotionData = async (req, res) => {
  const db = getDb();
  try {
    const promotionId = req.params.id;
    const promotionData = req.body;
    const filter = { _id: ObjectId(promotionId) };

    const options = { upsert: true };
    const updatedDoc = {
      $set: promotionData,
    };

    const result = await db
      .collection("Promotions")
      .updateOne(filter, updatedDoc, options);
    if (result.modifiedCount === 1) {
      res.status(200).send({
        status: 200,
        message: "Successfully edited the Bhakti Promotion data",
        data: result,
      });
    } else {
      res.status(200).send({
        status: 200,
        message: "Already edited the Data",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "Failed to Edit Data",
      error: error.message,
    });
  }
};
module.exports.deletePromotionData = async (req, res) => {
  const db = getDb();
  try {
    const promotionId = req.params.id;
    const query = { _id: ObjectId(promotionId) };

    const result = await db.collection("Promotions").deleteOne(query);
    res.status(200).send({
      status: 200,
      message: "Successfully deleted the Bhakti Promotions data",
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
