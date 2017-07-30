'use strict';

let parser = require('rss-parser');
let striptags = require('striptags');

let imageUrls = [
  'https://www.brisbane.qld.gov.au/sites/default/files/styles/event_hero/public/trumba/events/dgc17d3lpxtdeaw-uedae-0y_2.jpg',
  'https://www.brisbane.qld.gov.au/sites/default/files/styles/event_hero/public/trumba/events/dgc1wvuuwdrhpeamo94dstga_9.jpg',
  'https://www.brisbane.qld.gov.au/sites/default/files/styles/event_hero/public/trumba/events/dgcpn0lp6w-uyn0fy5e5irzg_9.jpg',
  'https://www.brisbane.qld.gov.au/sites/default/files/styles/event_hero/public/trumba/events/dgdylvvvplx9ro2x1czyfo09_3.jpg',
  'https://www.brisbane.qld.gov.au/sites/default/files/styles/event_hero/public/trumba/events/dgbmnz7stgbxmde0xs-ynns0.jpg',
  'https://www.brisbane.qld.gov.au/sites/default/files/styles/event_hero/public/trumba/events/dganywukw5csavfypeyfjyjj_1.jpg',
  'https://www.brisbane.qld.gov.au/sites/default/files/styles/event_hero/public/trumba/events/dgdlk1nvwpuhzo1q7r4r8qo_6.jpg'
];

let feedUrls = {
    activeParks: "http://www.trumba.com/calendars/active-parks.rss",
    classesWorkshops: "http://www.trumba.com/calendars/type.rss?filterview=classses",
    powerhouse: "http://www.trumba.com/calendars/brisbane-powerhouse.rss",
    chillOut: "http://www.trumba.com/calendars/chill-out.rss",
    family: "http://www.trumba.com/calendars/audience-brisbane.rss?filterview=family",
    festivals: "http://www.trumba.com/calendars/type.rss?filterview=festivals",
    greenEvents: "http://www.trumba.com/calendars/green-events.rss?filterview=green_events",
    infants: "http://www.trumba.com/calendars/brisbane-kids.rss?filterview=infants_toddlers",
    kids6to12: "http://www.trumba.com/calendars/brisbane-kids.rss?filterview=kids_6_12",
    teens: "http://www.trumba.com/calendars/brisbane-kids.rss?filterview=teens",
    museum: "http://www.trumba.com/calendars/mob.rss",
    riverstage: "http://www.trumba.com/calendars/brisbane-riverstage.rss",
    libraries: "http://www.trumba.com/calendars/libraries.rss",
    markets: "http://www.trumba.com/calendars/type.rss?filterview=Markets",
    artsCulture: "http://www.trumba.com/calendars/type.rss?filterview=arts",
    botanicGardens: "http://www.trumba.com/calendars/brisbane-botanic-gardens.rss",
    valley: "http://www.trumba.com/calendars/brisbanes-calendar-venues-calendar.rss?filterview=Valley%20Malls",
    music: "http://www.trumba.com/calendars/type.rss?filterview=Music",
    business: "http://www.trumba.com/calendars/BiB.rss",
    fitness: "http://www.trumba.com/calendars/type.rss?filterview=Fitness",
    parks: "http://www.trumba.com/calendars/brisbane-events-rss.rss?filterview=parks",
    cityHall: "http://www.trumba.com/calendars/city-hall.rss?filterview=city-hall",
    all: "http://www.trumba.com/calendars/type.rss"
  };

function parseRSS(url) {
  return new Promise(function(resolve,reject){
      let options = {
        customFields: {
          feed: [['Event image', 'image']]
        }
      }
      
      // Grab and parse the RSS feed
      parser.parseURL(url, options, function(err, parsed) {
          // Print the title of this rss feed
          console.log(parsed.feed.title);

          let items = [];

          // Loop through each RSS feed item
          parsed.feed.entries.forEach(function(entry) {
              // If it's an article that mentions keyword
              if (true) { //entry.content.indexOf(keyword) > -1
                  console.log(entry.title + ":");
                  //console.log(entry.contentSnippet);
                  console.log("More info: " + entry.link + "\n");

                  let item = {title:striptags(entry.title),
                      shortDescription:striptags(entry.contentSnippet),
                      longDescription:striptags(entry.content),
                      link:striptags(entry.link)
                  };

                  items.push(item);
              }
          });
          let random = Math.floor(Math.random() * items.length);
          console.log("Picked: " + items[random].category)
          resolve(items[random]);
      });
    });
}

module.exports.hello = (event, context, finalCallback) => {
  let entities = JSON.parse(event.body).result.parameters;
  let apirequest = JSON.parse(event.body);
  let body = {
    "speech": "Sorry, please try saying that again.",
    "displayText": "Sorry, please try saying that again.",
    "data": {},
    "contextOut": [],
    "source": "BCC Live Event Feeds"
  }
  let response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };

  console.log("Request Data:\n" + apirequest);

  let capabilities = apirequest.originalRequest.data.surface.capabilities[0].name;

  if (entities.event_type === undefined || entities.event_type.length == 0) {
    console.log("no type was specified. running with all");
    
    let simple_response = {
      'simpleResponse': {
        'textToSpeech': "Here you go, I found one for you.",
        'displayText': "Here's some info.",
      }
    };

    let simple_response_links = {
      'simpleResponse': {
        'textToSpeech': "Council provided an incorrect link. Click the search button below to manually search for it on their website.",
        'displayText': "Unfortunately council has provided an incorrect link for this event.",
      }
    };

    let url_button = {
      "title": "Search for this event",
      "openUrlAction": {
        "url": "https://www.brisbane.qld.gov.au/whats-on",
      },
    }

    let card_response = {
      "basicCard": {
        "title": "Unkown Title",
        "formattedText": "Unknown Description",
        "image": {
          "url": "http://i0.kym-cdn.com/entries/icons/mobile/000/005/608/nyan-cat-01-625x450.jpg",
          "accessibilityText": "NYAN CAT"
        },
        "buttons": [url_button]
      }
    }

    let rand = Math.floor(Math.random() * imageUrls.length);
    card_response.basicCard.image.url = imageUrls[rand];
    console.log("image: " + imageUrls[rand]);

    let resp = {
      'data': {
        'google': {
          'expectUserResponse': true,
          'isSsml': false,
          'noInputPrompts': [],
          'richResponse': {
            'items': [
              simple_response, simple_response_links, card_response, 
            ],
            'suggestions': [
              //{ 'title': 'Send me a link' }
            ]
          },
          'speech': {
            "textToSpeech": 'default_response',
            "ssml": 'default_response',
            "displayText": 'default_response',
          }
        }
      }
    }

    let all = parseRSS(feedUrls.all);
    all.then(function(res) { // success
      console.log('done - event - success');
      console.log('returned: ' + res)
      let description = res.shortDescription.replace(/&nbsp;/gi, '').replace(/&ndash;/gi, '').split(".")[0];
      description += ".";
      //description = description.replace(/(\d:\d{1,2})\d{1,2}/g, "$& to ");
      //console.log("regex: " + description.search(/(\d:\d{1,2})\d{1,2}/g));
      let title = res.title;
      let link = res.link;
      let image = res.image;

      // Build the response
      card_response.basicCard.formattedText = description;
      card_response.basicCard.title = title;
      //card_response.basicCard.image = image;
      //url_button.openUrlAction.url = link;
      resp.data.google.speech.displayText = "Title: " + title + " Description: " + description + ".";
      resp.data.google.speech.textToSpeech = "I found one for you.  Check your email for the link.  It's called " + title + ".";

      response.body = JSON.stringify(resp);
      finalCallback(null, response);
    }, function() { // failure
      console.log('done - event - failure');
      body.speech = "Unknown error.  Please try again in a few minutes.";
      body.displayText = "Unknown error.  Please try again in a few minutes. :(";
      response.body = "nah boi";
      finalCallback(null, response);
    })
  }
  else {
    console.log('done - no event recognised');
    if (entities.event_type.length === 2) body.speech = "Sorry, I don't support the event types " + entities.event_type[0] + " or " + entities.event_type[1];
    else if (entities.event_type.length === 1) body.speech = "Sorry, I don't support the event type " + entities.event_type[0];
    else body.speech = "Sorry, I don't support the event type " + entities.event_type[0] + ", " + entities.event_type[1]+ " or " + entities.event_type[2];
    body.speech += " yet.";
    body.displayText = "Event type(s) not supported. :(";
    response.body = JSON.stringify(body);
    finalCallback(null, response);
  }
};