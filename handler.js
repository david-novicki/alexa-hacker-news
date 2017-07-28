'use strict';
const fetchN = require('node-fetch');

module.exports.top3 = (event, context, callback) => {
  //const upperLimit = event.request.intent.slots.UpperLimit.value || 3;
  var titles = [];
  fetchN('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty').then((response) => {
    return response.json()
  }).then((articleIDs) => {
    let promises = articleIDs.slice(0, 3).map(item => fetchN(`https://hacker-news.firebaseio.com/v0/item/${item}.json`));
    return Promise.all(promises);
  }).then((data) => {
    return Promise.all(data.map((res) => res.json()))
  }).then((articles) => {
    titles = articles.map((arts, i) => {
      if (i == articles.length - 1) return `and "' + ${arts.title}"`;
      else return `"${arts.title}"`;
    });
    const response = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: `The top articles are ${titles.join(', ')}.`,
        },
        shouldEndSession: false,
      },
    };
    callback(null, response);
  }).catch(err => {
    console.log(err)
    callback(err);
  });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
