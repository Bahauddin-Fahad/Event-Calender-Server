const { getDb } = require("../utils/dbConnect");

module.exports.getHolidayData = async (req, res, next) => {
  const db = getDb();
  let queries = {};
  if (req.query.month) {
    queries.month = req.query.month.toLowerCase();
  }

  queries.data_language = req.query.data_language.toUpperCase();
  queries.year = parseInt(req.query.year);
  queries.app_language = req.query.app_language.toUpperCase();

  const holidays = await db.collection("Holidays").findOne(queries, {
    projection: { _id: 0 },
  });

  // .project({ _id: 0, app_language: 0, data_language: 0 })
  // .sort({ _id: 1 });

  if (holidays === null) {
    return res.status(404).send({
      status: 404,
      message: "Couldn't Get the data",
    });
  }
  res.status(200).send(holidays);
};
