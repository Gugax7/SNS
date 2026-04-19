const axios = require("axios");
const dlqDb = require("../models/Dlq");

async function redriveDlq() {
  const itemsToProcess = [...dlqDb];
  dlqDb.length = 0;

  let successes = 0;
  
  const axiosPromises = itemsToProcess.map((message) => {
    return axios
      .post(message.failedUrl, message.payload)
      .then((response) => {
        successes++;
        return { success: true, message };
      })
      .catch((err) => {
        message.retryAttempt = message.retryAttempt ? message.retryAttempt + 1 : 1;
        message.lastError = err.message;
        return { success: false, message };
      });
  });


  const newDlq = (await Promise.all(axiosPromises))
    .filter((attempt) => !attempt.success)
    .map((attempt) => attempt.message);


  dlqDb.push(...newDlq);

  return {fail: newDlq.length, success: success}
}

function listDlq() {
  return JSON.stringify(dlqDb);
}

// Todo: Delete from dead letter queue from topic arn


module.exports = {
  redriveDlq,
  listDlq,
}