const router = require("express").Router();
const notificationController = require("../controllers/sendNotificationController");

router.post("/send", notificationController.sendNotification);

module.exports = router;