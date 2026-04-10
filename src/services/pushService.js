const axios = require('axios');

const subscriberDb = require("../models/Subscriber");

const sendNotification = async (eventData) => {

  const clientUrls = [
    'http://localhost:3002/webhook',
    'http://localhost:3001/webhook',
    'http://localhost:3003/webhook',
    'http://dont.exist/mustFail',
  ];
  const payload = {
    event: 'New Subscription',
    timestamp: new Date().toISOString(),
    data: eventData
  }

  try{
    console.log('Sending new notification for ', clientUrls.length, ' clients');

    const sends = clientUrls.map((url) => {
      return axios.post(url, payload)
        .then((response) => {
          console.log(`Success -> ${url} (Status: ${response.status}`)
        })
        .catch((err) => {
          console.log(`Fail! -> ${url} (${err.message})`)
        })
    })

    await Promise.all(sends);

    console.log("====Notification processing finished!====");
  }catch(err){
    console.log("Fail to deliver notification: ", err.message);
  }
}

module.exports = {
  sendNotification
}