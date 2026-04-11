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

module.exports = {
  subscribe
}