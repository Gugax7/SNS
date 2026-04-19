const dlqService = require("../services/dlqService");

async function redriveDlq(req, res) {
  try {
    const report = await dlqService.redriveDlq();

    res.status(200).json({
      message: "Dlq redrive completed", 
      success: report.success, 
      fail: report.fail
    });
    
  } catch (err) {
    console.error("Erro no Redrive:", err);
    res.status(500).json({ error: "Failed to process DLQ redrive" });
  }
}

function listDlq(req, res) {
  try {
    const dlq = dlqService.listDlq();
    res.status(200).json({ dlq });
  } catch (err) {
    res.status(500).json({ error: "Failed to list DLQ" });
  }
}

module.exports = {
  listDlq,
  redriveDlq
}
