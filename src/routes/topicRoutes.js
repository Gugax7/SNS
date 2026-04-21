const router = require("express").Router();

const topicController = require("../controllers/topicController");

router.post('/', topicController.create);

router.get('/', topicController. list);
router.get('/:arn/attributes', topicController.getAttributes);

router.delete('/:arn', topicController.remove);

module.exports = router;