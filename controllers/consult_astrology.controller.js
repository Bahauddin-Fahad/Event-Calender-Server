const moment = require("moment");
const { getDb } = require("../utils/dbConnect");

module.exports.getConsultAstrologyData = async (req, res) => {
  const db = getDb();
  const dateNow = new Date();
  const startofToday = new Date(moment.utc(dateNow).startOf("day"));
  const oneWeekBeforeDate = new Date(moment.utc(dateNow).subtract(1, "weeks"));
  const oneMonthBeforeDate = new Date(
    moment.utc(dateNow).subtract(1, "months")
  );

  let queries = {};
  if (req.query?.language !== "all") {
    queries.language = req.query?.language?.toUpperCase();
  }
  if (req.query?.app_type !== "all") {
    queries.app_type = req.query?.app_type?.toLowerCase();
  }
  if (req.query?.day === "1") {
    queries.date = {
      $gte: startofToday,
      $lte: dateNow,
    };
  } else if (req.query?.day === "7") {
    queries.date = {
      $gte: oneWeekBeforeDate,
      $lte: dateNow,
    };
  } else if (req.query?.day === "30") {
    queries.date = {
      $gte: oneMonthBeforeDate,
      $lte: dateNow,
    };
  }

  try {
    const cursor = db
      .collection("Consult_Astrology")
      .find(queries)
      .sort({ date: -1 });
    const consultAstrologyData = await cursor.toArray();

    res.status(200).json({
      status: 200,
      message: "Successfully Got the Consult Astrology data",
      data: consultAstrologyData,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Could not get the data",
      error: error.message,
    });
  }
};

module.exports.saveConsultAstrologyData = async (req, res) => {
  const db = getDb();
  try {
    const details = req.body;
    details.language = details?.language.toUpperCase();
    details.app_type = details?.app_type.toLowerCase();
    details.phone = details.phone.toString();

    const { insertedId } = await db
      .collection("Consult_Astrology")
      .insertOne(details);
    details._id = insertedId;
    res.status(200).send({
      status: 200,
      message: "Successfully inserted the Consult Astrology data",
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
