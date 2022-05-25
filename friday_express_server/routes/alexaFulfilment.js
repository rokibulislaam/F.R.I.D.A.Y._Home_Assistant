const router = require("express").Router();
const DeviceState = require("../models/deviceState.model");

router.route("/").get(async (req, res) => {
  await DeviceState.findById("5e64db4546530a2700281b25").then(data => {
    res.json({
      state: data.state
    });
  });
});

router.route("/").post(async (req, res) => {
  await DeviceState.findById("5e64db4546530a2700281b25")
    .then(data => {
      data.state = req.query.state;
      data.save();
    })
    .then(() => res.json({ status: "success" }))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
