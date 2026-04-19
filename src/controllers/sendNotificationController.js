const notificationService = require('../services/publishService');

const sendNotification = (req, res) => {
  const data = req.body;

  notificationService.sendNotification(data).catch((err) => {
    console.log("background error to not compromise performance: ", err.message)
  });
  res.status(202).json("Notifications triggered!")

}

module.exports = {
  sendNotification
}