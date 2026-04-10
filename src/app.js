const express = require('express');
const app = express();
const topicsRoutes = require('./routes/topicRoutes')
const sendNotificationRoutes = require('./routes/sendNotificationRoutes');

app.use(express.json());

app.get('/health', (req,res) => {
  res.status(200).json({
    status: 'ok',
    message: 'server is running!',
    timestamp: new Date().toISOString,
  })
})

app.use('/topics', topicsRoutes);
app.use('/notifications', sendNotificationRoutes);

module.exports = app;