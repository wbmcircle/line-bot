'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'bn0e13LXWrwRQGZh3E5SGs/3WoRpx0iedKaqyP/HofFOG83ThOO2BjHRKKD4undqLbf4pOdsxKUwGpR6uIPa0ek/hij9KPIvoBYOi7BBDuqLpIo1Cj4qwFvX/vQ8QnrG7NPpA5WgQpUjxg1rMfWiEQdB04t89/1O/w1cDnyilFU=',
  channelSecret: '8f62f6fc3bdae3b72cb85b6d0f969ac3',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  console.log(event)
  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
