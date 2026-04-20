const subscriberService = require('../services/subscriberService');

const subscribe = (req, res) => {
  const clientInfo = req.body.clientInfo;
  const topicArn = req.body.topicArn;

  try{
    subscriberService.subscribe(topicArn, clientInfo);
    
    res.status(200).json({message:`${clientInfo.username || 'User'} Subscribed successfully`});
  }catch(err){
    res.status(400).json({error: err.message});
  }
}

const unsubscribe = (req, res) => {
  const endpoint = req.endpoint;
  const topicArn = req.topicArn

  try{
    if(!endpoint || !topicArn){
      throw new Error("Endpoint and TopicArn needed for unsubscription");
    }

    const response = subscriberService.unsubscribe(topicArn, endpoint);

    res.status(200).json(response);
    
  }catch(error){
    res.status(400).json({error: error.message});
  }
}

const listSubscriptionsOfTopic = (topicArn) => {
  try{
    const subscriptions = subscriberService.listSubscriptionsOfTopic(topicArn)
    res.status(200).json(subscriptions);
    
  }catch(error){
    res.status(400).json({error: error.message});
  }
}

module.exports = {
  subscribe,
  unsubscribe,
  listSubscriptionsOfTopic,
}