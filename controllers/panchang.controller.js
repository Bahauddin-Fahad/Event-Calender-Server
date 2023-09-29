const { getDb } = require("../utils/dbConnect");

module.exports.getPanchangData = async (req, res) => {
  const db = getDb();
  const universalDate = req.query.date;
  const app_language = req.query.app_language.toUpperCase();
  const data_language = req.query.data_language.toUpperCase();
  const day = await db.collection("Days").findOne({
    universalDate,
    app_language,
    data_language,
  });

  if (day === null) {
    return res.status(404).send({
      status: "Failed",
      message: "Couldn't Get the data",
    });
  }
  res.status(200).send(day);
  // const dateQuery = req.query.date.split("/");
  // const dayQuery = dateQuery[0];
  // const monthQuery = dateQuery[1];
  // const yearQuery = dateQuery[2];
  // const formattedDate = `${monthQuery}/${dayQuery}/${yearQuery}`;
  // const momentDate = moment(formattedDate).format("DD MMMM YYYY dddd");
  // const month = momentDate.split(" ")[1].toLowerCase();
  // const year = parseInt(momentDate.split(" ")[2]);
  // const app_language = req.query.app_language.toUpperCase();
  // const data_language = req.query.data_language.toUpperCase();
  // const monthData = await panchangCollection.findOne({
  //   month,
  //   year,
  //   app_language,
  //   data_language,
  // });
  // if (monthData === null) {
  //   return res.status(404).send({
  //     status: "Failed",
  //     message: "Couldn't Get the data",
  //   });
  // } else {
  //   const dayData = monthData[momentDate][0];
  //   res.status(200).send(dayData);
  // }
};
