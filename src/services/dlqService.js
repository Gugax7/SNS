const axios = require("axios");
const dlqDb = require("../models/Dlq");
const logs = require("../models/Logs");
const { dispatchMessage } = require("../utils/dispatch");


async function redriveDlq() {
  const itemsToProcess = [...dlqDb];
  dlqDb.length = 0;

  let successes = 0;
  
  const redrivePromises = itemsToProcess.map(async (message) => {
    if(message.maxDlqAttempts > message.dlqAttempts){
      try{
        await dispatchMessage(message.failedEndpoint, message.protocol, message.payload);

        successes++

        logs.push({
          endpoint: message.failedEndpoint,
          status: 'SUCCESS',
          deliveredAt: new Date().toISOString(),
          deliveredBy: "Dlq",
          attempt: message.dlqAttempts + 1,
        })

        return { success: true, message };
      }catch(err) {
        message.dlqAttempts = (message.dlqAttempts || 0) + 1;
        message.lastError = err.message;

        logs.push({
          endpoint: message.failedEndpoint,
          status: 'ERROR',
          errorDetail: err.message,
          attemptedAt: new Date().toISOString(),
          attempt: message.dlqAttempts
        });

        return { success: false, message, isDead: false };
      };
    }
    message.lastError = "Max DLQ attempts reached. Message permanently discarded.";

    logs.push({
      endpoint: message.failedEndpoint,
      status: 'ERROR',
      errorDetail: message.lastError,
      attemptedAt: new Date().toISOString(),
      attempt: message.dlqAttempts
    });

    return { success: false, message, isDead: true }
  });

  

  const newDlq = (await Promise.all(redrivePromises))
    .filter((message) => !message.success && !message.isDead)
    .map((message) => message.message);

  const deletedPermanently = redrivePromises.length - newDlq.length;

  dlqDb.push(...newDlq);

  return {fail: newDlq.length, success: successes, deletedPermanently}
}

function listDlq() {
  return dlqDb;
}

// Todo: Delete from dead letter queue from topic arn


module.exports = {
  redriveDlq,
  listDlq,
}