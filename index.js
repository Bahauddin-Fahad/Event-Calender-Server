const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const moment = require("moment");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustereventcalender.ywkdpkw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const languagesCollection = client
      .db("eventCalender")
      .collection("Languages");
    const yearsCollection = client.db("eventCalender").collection("Years");
    const monthsCollection = client.db("eventCalender").collection("Months");
    const daysCollection = client.db("eventCalender").collection("Days");
    const panchangCollection = client
      .db("eventCalender")
      .collection("Panchang");
    const holidaysCollection = client
      .db("eventCalender")
      .collection("Holidays");

    app.get("/languages", async (req, res) => {
      const query = {};
      const cursor = languagesCollection.find(query);
      const languages = await cursor.toArray();
      res.send(languages);
    });

    app.get("/years", async (req, res) => {
      const query = {};
      const cursor = yearsCollection.find(query);
      const years = await cursor.toArray();
      res.send(years);
    });

    app.get("/:year/months", async (req, res) => {
      const year = req.params.year;
      const query = { year };
      const cursor = monthsCollection.find(query);
      const months = await cursor.toArray();
      console.log(months);
      res.send(months);
    });

    app.get("/:year/:monthName", async (req, res) => {
      const monthName = req.params.monthName;
      const year = req.params.year;
      const query = { name: monthName, year };
      const month = await monthsCollection.findOne(query);
      if (month === null) {
        res.status(404);
      }
      res.send(month);
    });

    app.get("/day/:date/:language", async (req, res) => {
      const date = req.params.date;
      const language = req.params.language;
      const query = { universalDate: date, language };
      const events = await daysCollection.findOne(query);
      if (events === null) {
        res.status(404);
      }
      delete events?._id;
      delete events?.universalDate;
      res.send(events);
    });

    //New API's
    app.get("/day", async (req, res) => {
      // const date = moment(req.query.date).format("DD MM YY");
      // // console.log(date);
      // const momentDate = moment(date).format("DD MMMM YYYY dddd");
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
      let queries = {};
      if (req.query.data_language) {
        queries.data_language = req.query.data_language.toUpperCase();
      }
      (queries.universalDate = req.query.date.toLowerCase()),
        (queries.app_language = req.query.app_language.toUpperCase());

      const day = await daysCollection.findOne(queries);

      if (day === null) {
        return res.status(404).send({
          status: "Failed",
          message: "Couldn't Get the data",
        });
      }
      res.status(200).send(day);
    });

    app.get("/month", async (req, res) => {
      const month = req.query.month.toLowerCase();
      const year = parseInt(req.query.year);
      const app_language = req.query.app_language.toUpperCase();
      const data_language = req.query.data_language.toUpperCase();
      const monthData = await panchangCollection.findOne(
        {
          month,
          year,
          app_language,
          data_language,
        },
        {
          projection: { _id: 0 },
        }
      );
      if (monthData === null) {
        return res.status(404).send({
          status: "Failed",
          message: "Couldn't Get the data",
        });
      } else {
        res.status(200).send(monthData);
      }
    });

    app.get("/holiday", async (req, res) => {
      let queries = {};
      if (req.query.month) {
        queries.month = req.query.month.toLowerCase();
      }
      if (req.query.data_language) {
        queries.data_language = req.query.data_language.toUpperCase();
      }
      (queries.year = req.query.year),
        (queries.app_language = req.query.app_language.toUpperCase());
      const cursor = await holidaysCollection
        .find(queries)
        .project({ _id: 0, app_language: 0, data_language: 0 })
        .sort({ _id: 1 });
      const holidays = await cursor.toArray();
      if (holidays.length === 0) {
        return res.status(404).send({
          status: "Failed",
          message: "Couldn't Get the data",
        });
      }
      res.status(200).send(holidays);
    });
    app.get("/festival", async (req, res) => {
      let queries = {};
      if (req.query.month) {
        queries.Month = req.query.month.toLowerCase();
      }
      if (req.query.data_language) {
        queries.data_language = req.query.data_language.toUpperCase();
      }
      (queries.Year = req.query.year),
        (queries.app_language = req.query.app_language.toUpperCase());
      const cursor = await daysCollection
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
      res.status(200).send({
        status: "Success",
        message: "Successfully got the data",
        data: festivals,
      });
    });
    app.get("/muhurat", async (req, res) => {
      let queries = {};
      if (req.query.month) {
        queries.Month = req.query.month.toLowerCase();
      }
      if (req.query.data_language) {
        queries.data_language = req.query.data_language.toUpperCase();
      }
      (queries.Year = req.query.year),
        (queries.app_language = req.query.app_language.toUpperCase());
      const cursor = await daysCollection
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
          status: "Failed",
          message: "Couldn't Get the data",
        });
      }
      res.status(200).send({
        status: "Success",
        message: "Successfully got the data",
        data: muhurat,
      });
    });

    let json = require("./public/json.json");

    app.get("/json", async (req, res) => {
      const months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];

      const ArrayOfKeys = Object.keys(json);
      ArrayOfKeys.map((key) => {
        months.map((month) => {
          if (months.indexOf(month) === ArrayOfKeys.indexOf(key)) {
            json[key].month = month;
            json[key].year = 2025;
            (json[key].app_language = "GU"), (json[key].data_language = "GU");
          }
        });
      });
      res.send(json);
    });

    // app.get("/newDay", async (req, res) => {
    //   const date = moment(req.query.date).format("DD MM YY");
    //   const momentDate = moment(date).format("DD MMMM YYYY dddd");
    //   const month = momentDate.split(" ")[1].toLowerCase();
    //   const year = parseInt(momentDate.split(" ")[2]);
    //   const app_language = req.query.app_language.toUpperCase();
    //   const data_language = req.query.data_language.toUpperCase();
    //   const monthData = await days2Collection.findOne({
    //     month,
    //     year,
    //     app_language,
    //     data_language,
    //   });
    //   if (monthData === null) {
    //     return res.status(404).send({
    //       status: "Failed",
    //       message: "Couldn't Get the data",
    //     });
    //   } else {
    //     const dayData = monthData[momentDate][0];
    //     res.status(200).send(dayData);
    //   }
    // });

    // app.get("/json", async (req, res) => {
    //   const keys = Object.keys(json);
    //   const values = Object.values(json);
    //   const data = [];
    //   values.map((value) => {
    //     const indexOfValue = values.indexOf(value);
    //     let valueObj = value[0];
    //     valueObj.language = "telegu";
    //     keys.map((key) => {
    //       const indexOfKey = keys.indexOf(key);
    //       if (indexOfValue === indexOfKey) {
    //         valueObj.universalDate = key;
    //       }
    //     });
    //     data.push(valueObj);
    //   });
    //   res.send(data);
    // });

    // app.get("/insertHoliday", async (req, res) => {
    //   const keys = Object.keys(holiday);
    //   const values = Object.values(holiday);
    //   // console.log(keys);
    //   keys.map((key) => {
    //     const indexOfKey = keys.indexOf(key);
    //     values.map((value) => {
    //       const indexOfValue = values.indexOf(value);
    //       if (indexOfKey === indexOfValue) {
    //         value.map((v1) => {
    //           v1.map((v2) => {
    //             console.log(v2);
    //             // json.map((singleJson) => {
    //             //   const jsondate = singleJson.universalDate.split(" ")[0];
    //             //   const day = v2.date.split(" ")[0];
    //             //   const month = v2.date.split(" ")[1];
    //             //   const date = v2.date.split(" ")[2];
    //             //   const year = v2.date.split(" ")[3];
    //             //   if (
    //             //     singleJson.universalDate.includes(day) &&
    //             //     jsondate === date &&
    //             //     singleJson.universalDate.includes(month) &&
    //             //     singleJson.universalDate.includes(year)
    //             //   ) {
    //             //     singleJson[`${key} Holiday`] = v2.title;
    //             //   }
    //             //   if (!singleJson["Hindu Holiday"]) {
    //             //     singleJson["Hindu Holiday"] = "N/A";
    //             //   }
    //             //   if (!singleJson["Islamic Holiday"]) {
    //             //     singleJson["Islamic Holiday"] = "N/A";
    //             //   }
    //             //   if (!singleJson["Christian Holiday"]) {
    //             //     singleJson["Christian Holiday"] = "N/A";
    //             //   }
    //             //   if (!singleJson["Government Holiday"]) {
    //             //     singleJson["Government Holiday"] = "N/A";
    //             //   }
    //             // });
    //           });
    //         });
    //       }
    //     });
    //   });
    //   res.send(holiday);
    // });

    // app.get("/insertMonthYear", (req, res) => {
    //   const months = [
    //     "January",
    //     "February",
    //     "March",
    //     "April",
    //     "May",
    //     "June",
    //     "July",
    //     "August",
    //     "September",
    //     "October",
    //     "November",
    //     "December",
    //   ];
    //   json.map((singlejson) => {
    //     const day = singlejson.universalDate;
    //     const date = day.split(" ")[0];
    //     const month = day.split(" ")[1];
    //     const year = day.split(" ")[2];
    //     singlejson.Month = month.toLowerCase();
    //     singlejson.Year = year;
    //     singlejson.universalDate = `${date}/${
    //       months.indexOf(month) + 1
    //     }/${year.slice(2, 4)}`;
    //   });
    //   res.send(json);
    // });

    // app.get("/convertHolidayDate", async (req, res) => {
    //   // const keys = Object.keys(holiday);
    //   const values = Object.values(holiday);
    //   values.map((v1) => {
    //     v1.map((v2) => {
    //       v2.map((v3) => {
    //         const date = v3.date.split(" ")[2];
    //         const day = v3.date.split(" ")[0];
    //         const month = v3.date.split(" ")[1];
    //         const year = v3.date.split(" ")[3];
    //         json.map((singleJson) => {
    //           const jsondate = singleJson.universalDate.split(" ")[0];
    //           if (
    //             singleJson.universalDate.includes(day) &&
    //             jsondate === date &&
    //             singleJson.universalDate.includes(month) &&
    //             singleJson.universalDate.includes(year)
    //           ) {
    //             v3.date = singleJson.universalDate;
    //           }
    //         });
    //       });
    //     });
    //   });
    //   res.send(holiday);
    // });

    // app.get("/getHoliday", (req, res) => {
    //   const keys = Object.keys(holiday);
    //   const values = Object.values(holiday);
    //   json.map((singleJson) => {
    //     singleJson.app_language = "ML";
    //     singleJson.data_language = "ML";
    //     values.map((v1) => {
    //       keys.map((key) => {
    //         v1.map((v2) => {
    //           v2.map((v3) => {
    //             const month = v3.date.split(" ")[1].toLowerCase();

    //             if (singleJson.month.includes(month)) {
    //               if (holiday[key] === v1) {
    //                 if (key === "Hindu") {
    //                   if (singleJson.Hindu.indexOf(v3) === -1) {
    //                     singleJson.Hindu.push(v3);
    //                   }
    //                 }
    //                 if (key === "Islamic") {
    //                   if (singleJson.Islamic.indexOf(v3) === -1) {
    //                     singleJson.Islamic.push(v3);
    //                   }
    //                 }
    //                 if (key === "Christian") {
    //                   if (singleJson.Christian.indexOf(v3) === -1) {
    //                     singleJson.Christian.push(v3);
    //                   }
    //                 }
    //                 if (key === "Government") {
    //                   if (singleJson.Government.indexOf(v3) === -1) {
    //                     singleJson.Government.push(v3);
    //                   }
    //                 }
    //               }
    //             }
    //           });
    //         });
    //       });
    //     });
    //   });
    //   res.send(json);
    // });

    // app.get("/json", async (req, res) => {
    //   const months = [
    //     "January",
    //     "February",
    //     "March",
    //     "April",
    //     "May",
    //     "June",
    //     "July",
    //     "August",
    //     "September",
    //     "October",
    //     "November",
    //     "December",
    //   ];
    //   const ArrayOfDates = Object.keys(json);
    //   ArrayOfDates.map((dateKey) => {
    //     const dayData = json[dateKey][0];
    //     dayData.universalDate = dateKey;
    //     const date = dateKey.split(" ")[0];
    //     // console.log(date);
    //     const month = dateKey.split(" ")[1];
    //     const year = dateKey.split(" ")[2];
    //     dayData.Month = month.toLowerCase();
    //     dayData.Year = year;
    //     if (month.length === 1) {
    //       dayData.universalDate = `${date}/${
    //         months.indexOf(month) + 1
    //       }/${year.slice(2, 4)}`;
    //     } else {
    //       dayData.universalDate = `${date}/0${
    //         months.indexOf(month) + 1
    //       }/${year.slice(2, 4)}`;
    //     }
    //     // res.send(dayData);
    //   });
    //   res.send(json);
    // });
    // app.get("/check", async (req, res) => {
    //   const { date } = req.query;
    //   const data = json[`${date}`][0];
    //   res.send(data);
    // });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Event-Calender!");
});

app.listen(port, () => {
  console.log(`Event Calender listening on port ${port}`);
});
