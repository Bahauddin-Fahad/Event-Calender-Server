const { getDb } = require("../utils/dbConnect");

module.exports.getFestivalData = async (req, res) => {
  const db = getDb();
  let queries = {};
  if (req.query.month) {
    queries.Month = req.query.month.toLowerCase();
  }
  if (req.query.data_language) {
    queries.data_language = req.query.data_language.toUpperCase();
  }
  queries.Year = req.query.year;
  queries.app_language = req.query.app_language.toUpperCase();
  const cursor = await db
    .collection("Days")
    .find(queries)
    .project({
      _id: 0,
      date: 1,
      festivals: 1,
    })
    .sort({ _id: 1 });
  const festivals = await cursor.toArray();
  if (festivals.length === 0) {
    return res.status(404).send({
      status: "Failed",
      message: "Couldn't Get the data",
    });
  }
  res.status(200).send(festivals);

  // let queries = {};
  // let festivals = [];
  // if (req.query.month) {
  //   queries.month = req.query.month.toLowerCase();
  // }
  // (queries.year = parseInt(req.query.year)),
  //   (queries.app_language = req.query.app_language.toUpperCase());
  // queries.data_language = req.query.data_language.toUpperCase();

  // const monthData = await panchangCollection
  //   .find(queries, { projection: { _id: 0 } })
  //   .toArray();
  // if (monthData === null) {
  //   return res.status(404).send({
  //     status: "Failed",
  //     message: "Couldn't Get the data",
  //   });
  // }
  // monthData.map((singleMonthData) => {
  //   const values = Object.values(singleMonthData);

  //   values.map((value) => {
  //     if (typeof value === "object") {
  //       const data = value[0];
  //       let singleFestivalData = {};
  //       singleFestivalData.date = data?.date;
  //       singleFestivalData.festivals = data?.festivals;
  //       festivals.push(singleFestivalData);
  //     }
  //   });
  // });

  // res.status(200).send(festivals);
};
