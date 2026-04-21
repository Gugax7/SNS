const express = require('express');
const app = express();
const topicsRoutes = require('./routes/topicRoutes')
const sendNotificationRoutes = require('./routes/sendNotificationRoutes');
const subscriberRoute = require('./routes/subscriberRoutes');
const dlqRoutes = require('./routes/dlqRoutes');
const logRoutes = require("./routes/logRoutes");

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
app.use('/subscriber', subscriberRoute);
app.use('/dlq', dlqRoutes)
app.use('/logs', logRoutes)

module.exports = app;