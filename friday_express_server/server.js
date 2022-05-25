const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established");
});

const assistantFulfilmentRouter = require("./routes/assistantFulfilment");
const alexaFulfilment = require("./routes/alexaFulfilment");

app.use("/assistantFulfilment", assistantFulfilmentRouter);
app.use("/alexaFulfilment", alexaFulfilment);
app.use("/deviceStateFulfilment", require("./routes/deviceStateFulfilment"));
app.use("/app", require("./routes/appAPI"));

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
