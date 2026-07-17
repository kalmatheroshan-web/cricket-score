const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/cricplus');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connect;