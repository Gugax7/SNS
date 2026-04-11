const topicsDb = require("../models/Topic.js");
const { generateTopicArn } = require("../utils/arn.js");

const createTopic = (name, attributes = {}, subscribersMap = new Map()) => {
  if(!name){
    throw new Error("Name of topic is mandatory")
  }

  const topicArn = generateTopicArn();

  const newTopic = {
    topicArn,
    name,
    attributes,
    createdAt: new Date().toISOString(),
    subscribersMap
  }

  topicsDb.set(topicArn, newTopic);

  return newTopic;
}

const listTopics = () => {
  const rawTopics = [...topicsDb.values()];

  const topicsArray = rawTopics.map(topic => {
    return {
      ...topic,
      subscribersMap: Object.fromEntries(topic.subscribersMap) 
    };
  });

  return topicsArray;
}

const getTopicAttributes = (topicArn) => {
  const topic = topicsDb.get(topicArn)
  return topic?.attributes;
}

const deleteTopic = (topicArn) => {
  const topicExists = topicsDb.has(topicArn);
  if(topicExists) {
    topicsDb.delete(topicArn)
    return true;
  }
  return false;
}

module.exports = {
  createTopic,
  listTopics,
  getTopicAttributes,
  deleteTopic
}