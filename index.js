const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
      delete events?.language;
      res.send(events);
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
