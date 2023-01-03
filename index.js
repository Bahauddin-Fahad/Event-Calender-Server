import express, { json as _json } from "express";
import cors from "cors";
require("dotenv").config();
import { MongoClient, ServerApiVersion } from "mongodb";
import moment from "moment";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(_json());

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
      const universalDate = req.query.date;
      const app_language = req.query.app_language.toUpperCase();
      const data_language = req.query.data_language.toUpperCase();
      const day = await daysCollection.findOne({
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

      //  const dateQuery = req.query.date.split("/");
      //  const dayQuery = dateQuery[0];
      //  const monthQuery = dateQuery[1];
      //  const yearQuery = dateQuery[2];
      //  const formattedDate = `${monthQuery}/${dayQuery}/${yearQuery}`;
      //  const momentDate = moment(formattedDate).format("DD MMMM YYYY dddd");
      //  const month = momentDate.split(" ")[1].toLowerCase();
      //  const year = parseInt(momentDate.split(" ")[2]);
      //  const app_language = req.query.app_language.toUpperCase();
      //  const data_language = req.query.data_language.toUpperCase();

      //  const monthData = await panchangCollection.findOne({
      //    month,
      //    year,
      //    app_language,
      //    data_language,
      //  });

      //  if (monthData === null) {
      //    return res.status(404).send({
      //      status: "Failed",
      //      message: "Couldn't Get the data",
      //    });
      //  } else {
      //    const dayData = monthData[momentDate][0];
      //    res.status(200).send(dayData);
      //  }
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

      queries.data_language = req.query.data_language.toUpperCase();
      queries.year = parseInt(req.query.year);
      queries.app_language = req.query.app_language.toUpperCase();

      const holidays = await holidaysCollection.findOne(queries, {
        projection: { _id: 0 },
      });

      // .project({ _id: 0, app_language: 0, data_language: 0 })
      // .sort({ _id: 1 });

      if (holidays === null) {
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
      queries.Year = req.query.year;
      queries.app_language = req.query.app_language.toUpperCase();
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

    // let json = require("./public/json.json");
    // app.get("/json", async (req, res) => {
    //   const months = [
    //     "january",
    //     "february",
    //     "march",
    //     "april",
    //     "may",
    //     "june",
    //     "july",
    //     "august",
    //     "september",
    //     "october",
    //     "november",
    //     "december",
    //   ];

    //   const ArrayOfKeys = Object.keys(json);
    //   ArrayOfKeys.map((key) => {
    //     months.map((month) => {
    //       if (months.indexOf(month) === ArrayOfKeys.indexOf(key)) {
    //         json[key].month = month;
    //         json[key].year = 2025;
    //         (json[key].app_language = "TE"), (json[key].data_language = "TE");
    //       }
    //     });
    //   });
    //   res.send(json);
    // });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Bharat-Calendar!");
});

app.listen(port, () => {
  console.log(`Bharat Calendar listening on port ${port}`);
});
