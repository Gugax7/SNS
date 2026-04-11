const axios = require('axios');

const topicsDb = require("../models/Subscriber");

const sendNotification = async (eventData) => {

  console.log("eventData", eventData)

  const topic = topicsDb.get(eventData.topicArn);

  if(!topic){
    throw new Error("Error finding mentioned topic");
  }
  const subscribersUrls = Array.from(topic.subscribersMap.keys());

  const payload = {
    event: 'New Notification',
    timestamp: new Date().toISOString(),
    data: eventData
  }

  try{
    console.log('Sending new notification for ', subscribers.size, ' clients');

    const sends = subscribersUrls.map((url) => {
      return axios.post(url, payload)
        .then((response) => {
          console.log(`Success -> ${url} (Status: ${response.status}`)
        })
        .catch((err) => {
          console.log(`Cant reach user:  ->  ${url} (${err.message})`)
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