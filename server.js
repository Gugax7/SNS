require('dotenv').config();

const app = require('./src/app.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🐙 Server starting on port ${PORT}`);
  console.log(`🩺 Verify status with: http://localhost:${PORT}/health`);
})