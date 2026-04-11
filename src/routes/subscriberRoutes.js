const { subscribe } = require('../controllers/subscriberController');

const router = require('express').Router();

router.post('/subscribe', subscribe)

module.exports = router;