const axios = require('axios');

const topicsDb = require("../models/Topic");
const dlqDb = require("../models/Dlq");

function dispatchMessage(endpoint, protocol, payload){
  switch(protocol) {
    case 'http':
    case 'https':
      const response = axios.post(endpoint, payload);
      
      return response;

    case 'email':
      console.log(`📧 Simulando envio de E-MAIL para: ${endpoint}`);
      console.log(`   Assunto: Novo Evento | Corpo: ${JSON.stringify(payload)}`);
      
      return true;
    
    case 'sms':
      console.log(`📱 Simulando envio de SMS para: ${endpoint}`);
      console.log(`   Mensagem: Você tem uma nova notificação!`);
      // return await twilioClient.messages.create(...)
      return true;

    default:
      throw new Error(`Protocolo '${protocol}' não é suportado pelo sistema.`);

  }
}

const sendNotification = async (eventData) => {

  console.log("eventData", eventData)

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
    data: eventData
  }

  try{
    console.log('Sending new notification for ', filteredSubscribers.length, ' clients');

    const sends = filteredSubscribers.map(async ([endpoint, clientInfo]) => {
      try{
        await dispatchMessage(endpoint, clientInfo.protocol, payload);
        
        console.log(`✅ Success -> ${endpoint} [${clientInfo.protocol}]`);

      return { success: true, payload };
      } catch (err) {
        console.log(`❌ Fail -> ${endpoint} [${clientInfo.protocol}]. Enviando para DLQ...`);

        dlqDb.push({
                failedEndpoint: endpoint,
                topicArn: eventData.topicArn,
                payload,
                protocol: clientInfo.protocol,
                lastError: err.message,
                failedAt: new Date().toISOString(),
                attempts: 1
              })
        return { success: false, payload };
      }
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