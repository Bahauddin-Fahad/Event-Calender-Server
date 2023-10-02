const { getDb } = require("../utils/dbConnect");

module.exports.getMuhuratData = async (req, res) => {
  const db = getDb();
  let queries = {};
  if (req.query.month) {
    queries.Month = req.query.month.toLowerCase();
  }
  if (req.query.data_language) {
    queries.data_language = req.query.data_language.toUpperCase();
  }
  (queries.Year = req.query.year),
    (queries.app_language = req.query.app_language.toUpperCase());
  const cursor = await db
    .collection("Days")
    .find(queries)
    .project({
      _id: 0,
      date: 1,
      Property: 1,
      Vivah: 1,
      Vehicle: 1,
      GrihaPravesh: 1,
    })
    .sort({ _id: 1 });
  const muhurat = await cursor.toArray();
  if (muhurat.length === 0) {
    return res.status(404).send({
      status: 404,
      message: "Couldn't Get the data",
    });
  }
  res.status(200).send({
    status: 200,
    message: "Successfully got the data",
    data: muhurat,
  });
};
