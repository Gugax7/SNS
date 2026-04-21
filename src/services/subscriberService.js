const topicsDb = require("../models/Topic");

const SYSTEM_NOTIFICATION_ARN = "arn:local:sns:topic:7eb0c05c-b1c4-5tjb-b9ec-34801jk5d697"

const subscribe = (topicArn, clientInfo) => {
  const topic = topicsDb.get(topicArn);
  const systemTopic = topicsDb.get(SYSTEM_NOTIFICATION_ARN);

  if (!topic) {
    throw new Error("there is no topic with this arn");
  }

  if (!clientInfo || !clientInfo.url) {
    throw new Error("Client Url is mandatory to subscribe");
  }

  topic.subscribersMap.set(clientInfo.url, {
    ...clientInfo
  });
  systemTopic.subscribersMap.set(clientInfo.url, {
    ...clientInfo,
    filterPolicy: {}
  });

  console.log(
    `✅ ${clientInfo.username || "User"} subscribed successfully on: ${topic.name}`,
  );

  return {
    status: "success",
    topicArn: topic.topicArn,
    subscribedUrl: clientInfo.url,
  };
};

const unsubscribe = (topicArn, endpoint) => {
  const topic = topicsDb.get(topicArn);

  if (!topic) {
    throw new Error("there is no topic with this arn");
  }

  if (!endpoint) {
    throw new Error("Client Url is mandatory to unsubscribe");
  }

  topic.subscribersMap.delete(endpoint);

  console.log(
    `✅user with endpoint ${endpoint} Unsubscribed successfully of: ${topic.name}`,
  );

  return {
    status: "success",
    topicArn: topic.topicArn,
    subscribedUrl: endpoint,
  };
};

const listSubscriptionsOfTopic = (topicArn) => {
  const topic = topicsDb.get(topicArn);

  if(!topic) return {};

  return Object.fromEntries(topic.subscribersMap);
}

module.exports = {
  subscribe,
  unsubscribe,
  listSubscriptionsOfTopic
};
