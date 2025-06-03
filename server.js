const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); 
const socketIo = require('socket.io');
const http = require('http');
dotenv.config();
const corsOptions = {
  origin:process.env.APPLICATION_URL,
  methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
};



const app = express();
const server = http.createServer(app);
const io = socketIo(server);


// Middleware
app.use(express.json());
app.use(cors(corsOptions));
// Routes
app.use('/api/users', userRoutes);
app.use('/api', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes); 


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/renewli', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
require('./jobs/notificationScheduler');

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or close the application using this port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
