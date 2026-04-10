const axios = require('axios');

const sendNotification = async (eventData) => {

  const clientUrl = 'http://localhost:3001/webhook';
  const payload = {
    event: 'New Subscription',
    timestamp: new Date().toISOString(),
    data: eventData
  }

  try{
    console.log('Sending new notification for ', clientUrl);

    const response = await axios.post(clientUrl, payload);

    console.log("Notification sent! Client answered with status: ", response.status);
  }catch(err){
    console.log("Fail to deliver notification: ", err.message);
  }
}

module.exports = {
  sendNotification
}