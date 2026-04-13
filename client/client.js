const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.argv[2];

app.post("/webhook", (req, res) => {
  const payload = req.body;

  res.status(200).send({message: "received successfully!"});

  console.log("  🔔 new notification has arrived! 🔔");
  console.log(payload);
  console.log("     =============================");
})


app.listen(PORT, () => {
  console.log(`🚀 Cliente ouvindo notificações em http://localhost:${PORT}/webhook`)
})