const axios = require('axios');

const topicsDb = require("../models/Topic");

const sendNotification = async (eventData) => {

  console.log("eventData", eventData)

  const topic = topicsDb.get(eventData.topicArn)
  const messageAttributes = eventData.attributes;

  if(!topic){
    throw new Error("Error finding mentioned topic");
  }
  const filteredSubscribers = Array.from(topic.subscribersMap.entries())
    .filter(([url, {filterPolicy}]) => {
      return isMatch(messageAttributes, filterPolicy);
    })
  console.log("filteredSubscribers:", filteredSubscribers);

  const payload = {
    event: 'New Notification',
    timestamp: new Date().toISOString(),
    data: eventData
  }

  try{
    console.log('Sending new notification for ', filteredSubscribers.length, ' clients');

    const sends = filteredSubscribers.map(([url, clientInfo]) => {
      return axios.post(url, payload)
        .then((response) => {
          console.log(`Success -> ${url} (Status: ${response.status})`)
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

const isMatch = (messageAttributes = {}, userFilterPolicy = {}) => {
  const policyKeys = Object.keys(userFilterPolicy);

  if(policyKeys.length === 0) return true;

  for(const key of policyKeys){
    if(!messageAttributes[key]) return false;

    const acceptedValues = userFilterPolicy[key];

    if(!acceptedValues?.includes(messageAttributes[key])){
      return false;
    }
  }

  return true;

}

module.exports = {
  sendNotification
}