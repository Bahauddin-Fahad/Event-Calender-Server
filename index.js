const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

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
    // const days2Collection = client.db("eventCalender").collection("Days2");
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
    app.get("/month", async (req, res) => {
      let queries = {};
      if (req.query.data_language) {
        queries.data_language = req.query.data_language.toUpperCase();
      }
      (queries.Year = req.query.year),
        (queries.Month = req.query.month.toLowerCase()),
        (queries.app_language = req.query.app_language.toUpperCase());
      const cursor = await daysCollection
        .find(queries)
        .project({ _id: 0, Year: 0, Month: 0 })
        .sort({ universalDate: 1 });
      const events = await cursor.toArray();

      if (events.length === 0) {
        return res.status(404).send({
          status: "Failed",
          message: "Couldn't Get the data",
        });
      }
      res.status(200).send({
        status: "Success",
        message: "Successfully got the data",
        data: events,
      });
    });

    app.get("/day", async (req, res) => {
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
      res.status(200).send({
        status: "Success",
        message: "Successfully got the data",
        data: holidays,
      });
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
      const cursor = await days2Collection
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
      const cursor = await days2Collection
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
