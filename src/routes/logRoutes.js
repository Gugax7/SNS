const { listAllLogs } = require("../controllers/logController");

const router = require("express").Router();

router.get("/", listAllLogs);

module.exports = router;