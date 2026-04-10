const { v4: uuidv4 } = require('uuid');

const generateTopicArn = () => {
  return `arn:local:sns:topic:${uuidv4()}`;
}

const generateSubscriberArn = () => {
  return `arn:local:sns:subscription:${uuidv4()}`
}

module.exports = {
  generateTopicArn
}