const subscriberController = require('../controllers/subscriberController');

const router = require('express').Router();

router.post('/subscribe', subscriberController.subscribe)
router.post('/unsubscribe', subscriberController.unsubscribe)
router.get('/:topicArn', subscriberController.listSubscriptionsOfTopic)

module.exports = router;