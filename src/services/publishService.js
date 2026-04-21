const axios = require('axios');

const topicsDb = require("../models/Topic");
const dlqDb = require("../models/Dlq");
const logs = require("../models/Logs");
const { dispatchMessage } = require('../utils/dispatch');

const deduplicationCache = new Set();
const DEDUPLICATION_WINDOW_MS = 5 * 60 * 1000;

const sendNotification = async (eventData) => {
  const dedupId = eventData.MessageDeduplicationId;

  if(dedupId){
    if(deduplicationCache.has(dedupId)){
      console.log(`♻️ Deduplicação: Mensagem repetida ignorada (ID: ${dedupId})`);
      return;
    }

    deduplicationCache.add(dedupId);

    setTimeout(() => deduplicationCache.delete(dedupId), DEDUPLICATION_WINDOW_MS);
  }

  const topic = topicsDb.get(eventData.topicArn)
  const messageAttributes = eventData.attributes;

  if(!topic){
    throw new Error("Error finding mentioned topic");
  }
  const filteredSubscribers = Array.from(topic.subscribersMap.entries())
    .filter(([endpoint, {filterPolicy}]) => {
      return isMatch(messageAttributes, filterPolicy);
    })
  console.log("filteredSubscribers:", filteredSubscribers);

  const payload = {
    event: 'New Notification',
    timestamp: new Date().toISOString(),
    MessageGroupId: eventData.MessageGroupId || null,
    MessageDeduplicationId: dedupId || null,
    data: eventData
  }

  try{
    console.log('Sending new notification for ', filteredSubscribers.length, ' clients');

    const sends = filteredSubscribers.map(async ([endpoint, clientInfo]) => {

      const MAX_RETRIES = 2;
      for(let attempts = 0; attempts < MAX_RETRIES; attempts++){
        try{
          await dispatchMessage(endpoint, clientInfo.protocol, payload);
          
          console.log(`✅ Success -> ${endpoint} [${clientInfo.protocol}]`);

          logs.push({
            endpoint,
            status: 'SUCCESS',
            deliveredAt: new Date().toISOString()
          })

          break;
        } 
        catch (err) {  
          logs.push({
            endpoint,
            status: 'ERROR',
            errorDetail: err.message,
            attemptedAt: new Date().toISOString()
          });

          if(attempts === MAX_RETRIES - 1){
            console.log(`❌ Fail -> ${endpoint} [${clientInfo.protocol}]. Sending to DLQ...`);
            
            dlqDb.push({
                  failedEndpoint: endpoint,
                  topicArn: eventData.topicArn,
                  payload,
                  maxDlqAttempts: clientInfo.maxDlqRetries ?? 3,
                  protocol: clientInfo.protocol,
                  lastError: err.message,
                  failedAt: new Date().toISOString(),
                  dlqAttempts: 0
                })
          }
          else{
            console.log(`❌ Fail -> ${endpoint} [${clientInfo.protocol}]. Trying again...`);
          
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
    })

    await Promise.all(sends);

    console.log("====Notification processing finished!====");
  }catch(err){
    console.log("Fail to deliver notification: ", err.message);
  }
}

const isMatch = (messageAttributes = {}, userFilterPolicy = {}) => {
  if(Array.isArray(userFilterPolicy)){
    return userFilterPolicy.some((policy) => isMatch(messageAttributes, policy));
  } // if you want some multiple filter here too... like age > 30 and plan basic or just age < 30;

  const policyKeys = Object.keys(userFilterPolicy);

  if(policyKeys.length === 0) return true;

  for(const key of policyKeys){
    const msgValue = messageAttributes[key];

    if(!msgValue) return false; // if there isnt any attributes that match the filter policy it fail instantly

    const rules = userFilterPolicy[key]; // because now each user has multiple filters with multiple rules inside
    let matchedAtLeastOneRule = false;

    for(const rule of rules){
      if(typeof rule === "string" || typeof rule === "number"){
        if(msgValue === rule) matchedAtLeastOneRule = true
      }

      else if(typeof rule === "object") {
        if(rule.prefix){
          if(typeof msgValue === 'string' && msgValue.startsWith(rule.prefix)){
            matchedAtLeastOneRule = true;
          }
        }

        else if(rule["anything-but"]){
          if(!rule["anything-but"].includes(msgValue)){
            matchedAtLeastOneRule = true
          }
        }

        else if(rule.numeric){
          let passedAllNumeric = true;

          for(let i = 0; i < rule.numeric.length; i += 2){
            const operator = rule.numeric[i];
            const targetNumber = rule.numeric[i + 1];

            if(operator === ">=" && !(msgValue >= targetNumber))  passedAllNumeric = false;
            if(operator === "<=" && !(msgValue <= targetNumber))  passedAllNumeric = false;
            if(operator === ">"  && !(msgValue > targetNumber))   passedAllNumeric = false;
            if(operator === "<"  && !(msgValue < targetNumber))   passedAllNumeric = false;
            if(operator === "="  && !(targetNumber === msgValue)) passedAllNumeric = false;
          }

          if(passedAllNumeric) matchedAtLeastOneRule = true;
        }
      }

      if(matchedAtLeastOneRule) break;
    }

    if(!matchedAtLeastOneRule) return false;
  }

  return true;
}

module.exports = {
  sendNotification
}