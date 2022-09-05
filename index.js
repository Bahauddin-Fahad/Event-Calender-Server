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

    const monthsCollection = client.db("eventCalender").collection("MonthName");
    const daysCollection = client.db("eventCalender").collection("Days");

    app.get("/months", async (req, res) => {
      const query = {};
      const cursor = monthsCollection.find(query);
      const months = await cursor.toArray();
      res.send(months);
    });

    app.get("/:monthName", async (req, res) => {
      const monthName = req.params.monthName;
      const query = { name: monthName };
      const month = await monthsCollection.findOne(query);
      if (month === null) {
        res.status(404);
      }
      res.send(month);
    });
    app.get("/day/:date", async (req, res) => {
      const date = req.params.date;
      const query = { date };
      const events = await daysCollection.findOne(query);

      if (events === null) {
        res.status(404);
      }
      delete events._id;
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
