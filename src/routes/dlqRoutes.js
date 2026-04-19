const router = require("express").Router();
const dlqController = require("../controllers/dlqController");

router.post("/redrive", dlqController.redriveDlq);
router.get("/", dlqController, dlqController.listDlq)

module.exports = router;