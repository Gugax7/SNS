const topicsDb = require("../models/Topic");

const subscribe = (topicArn, clientInfo) => {
  const topic = topicsDb.get(topicArn);

  if (!topic) {
    throw new Error("there is no topic with this arn");
  }

  if (!clientInfo || !clientInfo.url) {
    throw new Error("Client Url is mandatory to subscribe");
  }

  topic.subscribersMap.set(clientInfo.url, clientInfo.username);

  console.log(
    `✅ ${clientInfo.username || "User"} subscribed successfully on: ${topic.name}`,
  );

  return {
    status: "success",
    topicArn: topic.topicArn,
    subscribedUrl: clientInfo.url,
  };
};

const unsubscribe = (topicArn, clientInfo) => {
  const topic = topicsDb.get(topicArn);

  if (!topic) {
    throw new Error("there is no topic with this arn");
  }

  if (!clientInfo || !clientInfo.url) {
    throw new Error("Client Url is mandatory to unsubscribe");
  }

  topic.subscribersMap.delete(clientInfo.url);

  console.log(
    `✅ ${clientInfo.username || "User"} Unsubscribed successfully of: ${topic.name}`,
  );

  return {
    status: "success",
    topicArn: topic.topicArn,
    subscribedUrl: clientInfo.url,
  };
};

module.exports = {
  subscribe,
  unsubscribe,
};
