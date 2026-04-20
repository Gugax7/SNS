const subscriberController = require('../controllers/subscriberController');

const router = require('express').Router();

router.post('/subscribe', subscriberController.subscribe)
router.post('/unsubscribe', subscriberController.unsubscribe)
router.get('/', subscriberController.listSubscriptionsOfTopic)

module.exports = router;