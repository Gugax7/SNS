const logs = require("../models/Logs");

function getAllLogs() {
  return logs;
}

module.exports = {
  getAllLogs,
}