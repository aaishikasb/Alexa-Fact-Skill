/*
 * Copyright 2018-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

//
// Alexa Fact Skill - Sample for Beginners
//

// sets up dependencies
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');

// core functionality for fact skill
const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    // gets a random fact by assigning an array to the variable
    // the random item from the array will be selected by the i18next library
    // the i18next library is set up in the Request Interceptor
    const randomFact = requestAttributes.t('FACTS');
    // concatenates a standard message with the random fact
    const speakOutput = requestAttributes.t('GET_FACT_MESSAGE') + randomFact;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      // Uncomment the next line if you want to keep the session open so you can
      // ask for another fact without first re-opening the skill
      // .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .withSimpleCard(requestAttributes.t('SKILL_NAME'), randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .reprompt(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    // Gets the locale from the request and initializes i18next.
    const localizationClient = i18n.init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
      returnObjects: true
    });
    // Creates a localize function to support arguments.
    localizationClient.localize = function localize() {
      // gets arguments through and passes them to
      // i18next using sprintf to replace string placeholders
      // with arguments.
      const args = arguments;
      const value = i18n.t(...args);
      // If an array is used then a random value is selected
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    // this gets the request attributes and save the localize function inside
    // it to be used in a handler by calling requestAttributes.t(STRING_ID, [args...])
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    }
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/basic-fact/v2')
  .lambda();

// TODO: Replace this data with your own.
// It is organized by language/locale.  You can safely ignore the locales you aren't using.
// Update the name and messages to align with the theme of your skill

const deData = {
  translation: {

  },
};

const dedeData = {
  translation: {
    SKILL_NAME: 'Weltraumwissen auf Deutsch',
  },
};

const enData = {
  translation: {
    SKILL_NAME: 'Tech Facts',
    GET_FACT_MESSAGE: 'Here\'s your fact: ',
    HELP_MESSAGE: 'You can say tell me a tech fact, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Tech Facts skill can\'t help you with that.  It can help you discover facts about tech if you say tell me a tech fact. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    FACTS:
      [
        'Over 3.8 billion people use the internet today, which is 40% of the world’s population.',
        '8 billion devices will be connected to the internet by 2020.',
        'More than 570 new websites are created every minute.',
        'There are over 3.5 billion searches per day on Google.',
        'Every minute 24 hours of video is uploaded to YouTube. More video content is uploaded to YouTube in a 60-day period than the three major U.S. television networks created in 60 years.',
        'By 2020, video will account for about 80% of all internet traffic.',
        '340,000 tweets are sent per minute.',
        '500 million tweets are sent per day.',
        'Facebook has more than 2 billion active users who have an average of 155 friends.',
        'There are more than 300 million photos uploaded to Facebook every day, 800 million likes per day, and 175 million love reactions per day.',
        'Your online reputation and privacy worst enemies are WhatsApp, Snapchat, Instagram, Google, Facebook, and Twitter.',
        'Facebook is a divorce lawyers best friend. In fact, 1 in 7 divorces are blamed on Facebook.',
        'Over 4.2 billion data records were stolen in 2016.',
        'More than 88 million people will be born this year. They will be born into a data and algorithm economy.',
        '90% of the world’s data has been created in the last couple years.',
      ],
  },
};

const enauData = {
  translation: {
    SKILL_NAME: 'Tech Facts',
    GET_FACT_MESSAGE: 'Here\'s your fact: ',
    HELP_MESSAGE: 'You can say tell me a tech fact, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Tech Facts skill can\'t help you with that.  It can help you discover facts about tech if you say tell me a tech fact. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    FACTS:
      [
        'Over 3.8 billion people use the internet today, which is 40% of the world’s population.',
        '8 billion devices will be connected to the internet by 2020.',
        'More than 570 new websites are created every minute.',
        'There are over 3.5 billion searches per day on Google.',
        'Every minute 24 hours of video is uploaded to YouTube. More video content is uploaded to YouTube in a 60-day period than the three major U.S. television networks created in 60 years.',
        'By 2020, video will account for about 80% of all internet traffic.',
        '340,000 tweets are sent per minute.',
        '500 million tweets are sent per day.',
        'Facebook has more than 2 billion active users who have an average of 155 friends.',
        'There are more than 300 million photos uploaded to Facebook every day, 800 million likes per day, and 175 million love reactions per day.',
        'Your online reputation and privacy worst enemies are WhatsApp, Snapchat, Instagram, Google, Facebook, and Twitter.',
        'Facebook is a divorce lawyers best friend. In fact, 1 in 7 divorces are blamed on Facebook.',
        'Over 4.2 billion data records were stolen in 2016.',
        'More than 88 million people will be born this year. They will be born into a data and algorithm economy.',
        '90% of the world’s data has been created in the last couple years.',
      ],
  },
};

const encaData = {
  translation: {
    SKILL_NAME: 'Tech Facts',
    GET_FACT_MESSAGE: 'Here\'s your fact: ',
    HELP_MESSAGE: 'You can say tell me a tech fact, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Tech Facts skill can\'t help you with that.  It can help you discover facts about tech if you say tell me a tech fact. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    FACTS:
      [
        'Over 3.8 billion people use the internet today, which is 40% of the world’s population.',
        '8 billion devices will be connected to the internet by 2020.',
        'More than 570 new websites are created every minute.',
        'There are over 3.5 billion searches per day on Google.',
        'Every minute 24 hours of video is uploaded to YouTube. More video content is uploaded to YouTube in a 60-day period than the three major U.S. television networks created in 60 years.',
        'By 2020, video will account for about 80% of all internet traffic.',
        '340,000 tweets are sent per minute.',
        '500 million tweets are sent per day.',
        'Facebook has more than 2 billion active users who have an average of 155 friends.',
        'There are more than 300 million photos uploaded to Facebook every day, 800 million likes per day, and 175 million love reactions per day.',
        'Your online reputation and privacy worst enemies are WhatsApp, Snapchat, Instagram, Google, Facebook, and Twitter.',
        'Facebook is a divorce lawyers best friend. In fact, 1 in 7 divorces are blamed on Facebook.',
        'Over 4.2 billion data records were stolen in 2016.',
        'More than 88 million people will be born this year. They will be born into a data and algorithm economy.',
        '90% of the world’s data has been created in the last couple years.',
      ],
  },
};

const engbData = {
  translation: {
    SKILL_NAME: 'Tech Facts',
    GET_FACT_MESSAGE: 'Here\'s your fact: ',
    HELP_MESSAGE: 'You can say tell me a tech fact, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Tech Facts skill can\'t help you with that.  It can help you discover facts about tech if you say tell me a tech fact. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    FACTS:
      [
        'Over 3.8 billion people use the internet today, which is 40% of the world’s population.',
        '8 billion devices will be connected to the internet by 2020.',
        'More than 570 new websites are created every minute.',
        'There are over 3.5 billion searches per day on Google.',
        'Every minute 24 hours of video is uploaded to YouTube. More video content is uploaded to YouTube in a 60-day period than the three major U.S. television networks created in 60 years.',
        'By 2020, video will account for about 80% of all internet traffic.',
        '340,000 tweets are sent per minute.',
        '500 million tweets are sent per day.',
        'Facebook has more than 2 billion active users who have an average of 155 friends.',
        'There are more than 300 million photos uploaded to Facebook every day, 800 million likes per day, and 175 million love reactions per day.',
        'Your online reputation and privacy worst enemies are WhatsApp, Snapchat, Instagram, Google, Facebook, and Twitter.',
        'Facebook is a divorce lawyers best friend. In fact, 1 in 7 divorces are blamed on Facebook.',
        'Over 4.2 billion data records were stolen in 2016.',
        'More than 88 million people will be born this year. They will be born into a data and algorithm economy.',
        '90% of the world’s data has been created in the last couple years.',
      ],
  },
};

const eninData = {
  translation: {
    SKILL_NAME: 'Tech Facts',
    GET_FACT_MESSAGE: 'Here\'s your fact: ',
    HELP_MESSAGE: 'You can say tell me a tech fact, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Tech Facts skill can\'t help you with that.  It can help you discover facts about tech if you say tell me a tech fact. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    FACTS:
      [
        'Over 3.8 billion people use the internet today, which is 40% of the world’s population.',
        '8 billion devices will be connected to the internet by 2020.',
        'More than 570 new websites are created every minute.',
        'There are over 3.5 billion searches per day on Google.',
        'Every minute 24 hours of video is uploaded to YouTube. More video content is uploaded to YouTube in a 60-day period than the three major U.S. television networks created in 60 years.',
        'By 2020, video will account for about 80% of all internet traffic.',
        '340,000 tweets are sent per minute.',
        '500 million tweets are sent per day.',
        'Facebook has more than 2 billion active users who have an average of 155 friends.',
        'There are more than 300 million photos uploaded to Facebook every day, 800 million likes per day, and 175 million love reactions per day.',
        'Your online reputation and privacy worst enemies are WhatsApp, Snapchat, Instagram, Google, Facebook, and Twitter.',
        'Facebook is a divorce lawyers best friend. In fact, 1 in 7 divorces are blamed on Facebook.',
        'Over 4.2 billion data records were stolen in 2016.',
        'More than 88 million people will be born this year. They will be born into a data and algorithm economy.',
        '90% of the world’s data has been created in the last couple years.',
      ],
  },
};

const enusData = {
  translation: {
    SKILL_NAME: 'Tech Facts',
    GET_FACT_MESSAGE: 'Here\'s your fact: ',
    HELP_MESSAGE: 'You can say tell me a tech fact, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Tech Facts skill can\'t help you with that.  It can help you discover facts about tech if you say tell me a tech fact. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    FACTS:
      [
        'Over 3.8 billion people use the internet today, which is 40% of the world’s population.',
        '8 billion devices will be connected to the internet by 2020.',
        'More than 570 new websites are created every minute.',
        'There are over 3.5 billion searches per day on Google.',
        'Every minute 24 hours of video is uploaded to YouTube. More video content is uploaded to YouTube in a 60-day period than the three major U.S. television networks created in 60 years.',
        'By 2020, video will account for about 80% of all internet traffic.',
        '340,000 tweets are sent per minute.',
        '500 million tweets are sent per day.',
        'Facebook has more than 2 billion active users who have an average of 155 friends.',
        'There are more than 300 million photos uploaded to Facebook every day, 800 million likes per day, and 175 million love reactions per day.',
        'Your online reputation and privacy worst enemies are WhatsApp, Snapchat, Instagram, Google, Facebook, and Twitter.',
        'Facebook is a divorce lawyers best friend. In fact, 1 in 7 divorces are blamed on Facebook.',
        'Over 4.2 billion data records were stolen in 2016.',
        'More than 88 million people will be born this year. They will be born into a data and algorithm economy.',
        '90% of the world’s data has been created in the last couple years.',
      ],
  },
};

const esData = {
  translation: {

  },
};

const esesData = {
  translation: {
    SKILL_NAME: 'Curiosidades del Espacio para España',
  },
};

const esmxData = {
  translation: {
    SKILL_NAME: 'Curiosidades del Espacio para México',
  },
};

const esusData = {
  translation: {
    SKILL_NAME: 'Curiosidades del Espacio para Estados Unidos',
  },
};

const frData = {
  translation: {

  },
};

const frfrData = {
  translation: {
    SKILL_NAME: 'Anecdotes françaises de l\'espace',
  },
};

const frcaData = {
  translation: {
    SKILL_NAME: 'Anecdotes canadiennes de l\'espace',
  },
};

const hiData = {
  translation: {

  },
};

const hiinData = {
  translation: {
    SKILL_NAME: 'अंतरिक्ष फ़ैक्ट्स',
  },
}

const itData = {
  translation: {

  },
};

const ititData = {
  translation: {
    SKILL_NAME: 'Aneddoti dallo spazio',
  },
};

const jpData = {
  translation: {

  },
};

const jpjpData = {
  translation: {
    SKILL_NAME: '日本語版豆知識',
  },
};

const ptbrData = {
  translation: {
    SKILL_NAME: 'Fatos Espaciais',
  },
};

const ptData = {
  translation: {

  },
};

// constructs i18n and l10n data structure
const languageStrings = {
  'de': deData,
  'de-DE': dedeData,
  'en': enData,
  'en-AU': enauData,
  'en-CA': encaData,
  'en-GB': engbData,
  'en-IN': eninData,
  'en-US': enusData,
  'es': esData,
  'es-ES': esesData,
  'es-MX': esmxData,
  'es-US': esusData,
  'fr': frData,
  'fr-FR': frfrData,
  'fr-CA': frcaData,
  'hi': hiData,
  'hi-IN': hiinData,
  'it': itData,
  'it-IT': ititData,
  'ja': jpData,
  'ja-JP': jpjpData,
  'pt': ptData,
  'pt-BR': ptbrData,
};