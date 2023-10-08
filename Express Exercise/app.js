const express = require('express');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController')


const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

app.use(globalErrorHandler)

app.use((req, res) => {
  res.status(404).json({ error: 'Route does not exist' });
});


module.exports = app;