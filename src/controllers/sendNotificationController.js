const notificationService = require('../services/pushService');

const sendNotification = (req, res) => {
  const data = req.body;

  notificationService.sendNotification(data);

  res.status(200).json("Notification sent!")
}

module.exports = {
  sendNotification
}