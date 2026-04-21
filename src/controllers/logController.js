const logsService = require('../services/logsService');

function listAllLogs(req, res){
  res.status(200).json(logsService.getAllLogs());
}

module.exports = {
  listAllLogs
}