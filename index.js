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

    const getCollection = (month) => {
      const monthCollection = client.db("eventCalender").collection(month);
      return monthCollection;
    };
    const januaryCollection = getCollection("January");
    const februaryCollection = getCollection("February");
    const marchCollection = getCollection("March");
    const aprilCollection = getCollection("April");
    const mayCollection = getCollection("May");
    const juneCollection = getCollection("June");
    const julyCollection = getCollection("July");
    const augustCollection = getCollection("August");
    const septemberCollection = getCollection("September");
    const octoberCollection = getCollection("October");
    const novemberCollection = getCollection("November");
    const decemberCollection = getCollection("December");

    const getData = (month, monthCollection) => {
      getDays(month, monthCollection);
      getEvents(month, monthCollection);
    };

    getData("january", januaryCollection);
    getData("february", februaryCollection);
    getData("march", marchCollection);
    getData("april", aprilCollection);
    getData("may", mayCollection);
    getData("june", juneCollection);
    getData("july", julyCollection);
    getData("august", augustCollection);
    getData("september", septemberCollection);
    getData("october", octoberCollection);
    getData("november", novemberCollection);
    getData("december", decemberCollection);

    function getDays(month, daysCollection) {
      app.get(`/${month}`, async (req, res) => {
        const query = {};
        const cursor = daysCollection.find(query);
        const days = await cursor.toArray();
        res.send(days);
      });
    }

    function getEvents(month, daysCollection) {
      app.get(`/${month}/:id`, async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const events = await daysCollection.findOne(query);
        delete events?._id;
        res.send(events);
      });
    }
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
