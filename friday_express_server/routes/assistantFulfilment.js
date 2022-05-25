const router = require("express").Router();
const { WebhookClient } = require("dialogflow-fulfillment");
const DeviceState = require("../models/deviceState.model");

router.route("/").post((req, res) => {
  WebhookProcessing(req, res);
});

async function WebhookProcessing(req, res) {
  await DeviceState.findById("5e64db4546530a2700281b25").then(data => {
    const agent = new WebhookClient({
      request: req,
      response: res
    });
    const currentDeviceState = data.state;

    const [cantSee] = [agent.parameters["cantsee"]];

    function turnON(agent) {
      if (currentDeviceState === (true || "true")) {
        agent.add("Light is already turned ON");
      } else {
        agent.add("Turning ON light");
        if (cantSee) {
          agent.add("Hope you can see now");
        }
        data.state = true;
        data.save();
      }
    }

    function turnOFF(agent) {
      if (currentDeviceState === (false || "false")) {
        agent.add("Light is already turned OFF");
      } else {
        agent.add("Turning OFF light");

        data.state = false;
        data.save();
      }
    }

    const intentMap = new Map();
    intentMap.set("turnOn", turnON);
    intentMap.set("turnOff", turnOFF);
    agent.handleRequest(intentMap);
  });
}

module.exports = router;
