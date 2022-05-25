const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceStateSchema = new Schema({
  state: { type: Boolean, required: true }
});

const DeviceState = mongoose.model("DeviceState", deviceStateSchema);

module.exports = DeviceState;
