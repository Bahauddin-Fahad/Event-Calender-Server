const express = require("express"),
  expressRouter = express.Router();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const moment = require("moment");
const app = express();
const port = process.env.PORT || 5000;
var fs = require("fs");
const https = require("https");
const { connectToServer } = require("./utils/dbConnect");
const holidayRoute = require("./routes/holiday.route");
const panchangRoute = require("./routes/panchang.route");
const festivalRoute = require("./routes/festival.route");
const muhuratRoute = require("./routes/muhurat.route");
const paymentRoute = require("./routes/payment.route");

app.use(cors());
app.use(express.json());

var corsOptions = {
  //origin: 'http://localhost:4200',
  origin: "*",
  optionsSuccessStatus: 200,
};
// var options = {
//   key: fs.readFileSync(
//     "/etc/letsencrypt/live/debugpanchang.exaweb.in/privkey.pem"
//   ),
//   cert: fs.readFileSync(
//     "/etc/letsencrypt/live/debugpanchang.exaweb.in/cert.pem"
//   ),
//   ca: fs.readFileSync(
//     "/etc/letsencrypt/live/debugpanchang.exaweb.in/fullchain.pem"
//   ),
// };

// const httpserver = https.createServer(options, app);

connectToServer((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Bharat Calendar listening on port ${port}`);
    });
    // httpserver.listen(port, () => {
    //   console.log("HTTP Server running on port " + port);
    // });
  }
});

app.use("/holiday", holidayRoute);
app.use("/day", panchangRoute);
app.use("/festival", festivalRoute);
app.use("/muhurat", muhuratRoute);
app.use("/payments", paymentRoute);

// async function run() {
//   try {
//
//   } finally {
//   }
// }
// run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Bharat-Calendar!");
});

app.all("*", (req, res) => {
  res.send("No Route Found");
});

app.use(`/`, cors(corsOptions), expressRouter);
