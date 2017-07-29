'use strict';

let parser = require('rss-parser');
let striptags = require('striptags');

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
        // Grab and parse the RSS feed
        parser.parseURL(url, function(err, parsed) {
            // Print the title of this rss feed
            console.log(parsed.feed.title);

            let items = [];

            // Loop through each RSS feed item
            parsed.feed.entries.forEach(function(entry) {
                // If it's an article that mentions keyword
                if (true) { //entry.content.indexOf(keyword) > -1
                    //console.log(entry.title + ":");
                    //console.log(entry.contentSnippet);
                    //console.log("More info: " + entry.link + "\n");

                    let item = {title:striptags(entry.title),
                        shortDescription:striptags(entry.contentSnippet),
                        longDescription:striptags(entry.content),
                        link:striptags(entry.link)
                    };

                    items.push(item);
                }
            });
            resolve(items);
        });
    });
}

module.exports.hello = (event, context, finalCallback) => {
  let feeds = "heck";
  let entities = JSON.parse(event.body).result.parameters;
  let body = {
    "speech": "Speech",
    "displayText": "Displayed",
    "data": {},
    "contextOut": [],
    "source": "BCC Live Event Feeds"
  }
  let response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };

  if (entities.event_type === undefined || entities.event_type.length == 0) {
    console.log("no type was specified. running with all");
    
    let all = parseRSS(feedUrls.all);
    all.then(function() { // success
      console.log('done - event - success');
      response.body = JSON.stringify(body);
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