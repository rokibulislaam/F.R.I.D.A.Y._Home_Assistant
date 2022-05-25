const router = require("express").Router();
const DeviceState = require("../models/deviceState.model");

router.route("/").get(async (req, res) => {
  await DeviceState.findById("5e64db4546530a2700281b25").then(data => {
    res.json({
      state: data.state
    });
  });
});

module.exports = router;
