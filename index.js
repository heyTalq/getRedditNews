/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

var https = require('https');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            
            SKILL_NAME: 'reddit news',
            GET_FACT_MESSAGE: "Here's your fact: ",
            HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('AMAZON.HelpIntent');
    },
    'GetNewFactIntent': function () {
        this.emit('AMAZON.HelpIntent');
    },
    'getRedditNews': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        /*
        const factArr = this.t('FACTS');
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        */
        
        const intentRequest = this.event.request;
        var numbers = intentRequest.intent.slots.numbers.value;
        
        if(numbers === undefined){
            numbers = 1;
        }
        
        var obj = this
        var section = "top";
        var Times = "day";
        
        
        var Path = '/r/news/' + section + '.json?sort=' + section +'&t='+ Times +'&limit=' + numbers;
        var Domain = 'www.reddit.com';
        var options = {
            host: Domain,
            path: Path
        };
        var callback = function(response) {
          var str = '';
        
          //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) {
            str += chunk;
          });
        
          //the whole response has been recieved, so we just print it out here
          response.on('end', function () {
            console.log(str);
            var json = JSON.parse(str);
            var str1 = "";
            for(var i = 0; i < numbers; i++){
                var title = json.data.children[i].data.title;
                str1 = str1 + ", Post number " + (i+1) + ", " + title;
            }
            const speechOutput = str1;
            obj.emit(':tellWithCard',speechOutput);
            
          });
        }

        https.request(options, callback).end();


        // Create speech output
        
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
