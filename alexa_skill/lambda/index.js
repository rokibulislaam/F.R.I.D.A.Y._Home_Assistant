const Alexa = require("ask-sdk-core");
const fetch = require("node-fetch");
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Hello, welcome to friday, your personal home assistant. You can ask me to turn ON or OFF your home appliances";

    return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
  }
};


const turnOnIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "turnOn"
    );
  },
  async handle(handlerInput) {
    let speakOutput;
    const response = await fetch(
      "https://friday-server.now.sh/alexaFulfilment"
    ).then(data => data.json());

    if (response.state === (true || "true")) {
      speakOutput = "Light is already turned ON";
    } else {
      speakOutput = "Turning ON light";
      fetch("https://friday-server.now.sh/alexaFulfilment?state=true", {
        method: "POST"
      });
    }

    return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
  }
};



const turnOffIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "turnOff"
    );
  },
  async handle(handlerInput) {
    let speakOutput;
    const response = await fetch(
      "https://friday-server.now.sh/alexaFulfilment"
    ).then(data => data.json());

    if (response.state === false) {
      speakOutput = "Light is already turned OFF";
    } else {
      speakOutput = "Turning OFF light";
      fetch("https://friday-server.now.sh/alexaFulfilment?state=false", {
        method: "POST"
      });
    }

    return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
  }
};



const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = handlerInput.t("HELP_MSG");

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = handlerInput.t("GOODBYE_MSG");

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = handlerInput.t("FALLBACK_MSG");

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    return handlerInput.responseBuilder.getResponse();
  }
};
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = handlerInput.t("REFLECTOR_MSG", {
      intentName: intentName
    });

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput = handlerInput.t("ERROR_MSG");
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    turnOnIntentHandler,
    turnOffIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
