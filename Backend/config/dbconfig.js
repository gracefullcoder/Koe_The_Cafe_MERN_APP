const mongoose = require('mongoose');

connectDB()
  .then(() => {
    console.log("Connection was succesfull");
  })
  .catch(err => console.log(err));

async function connectDB() {
  const connectionString = process.env.MONGO_ATLAS_URL;
  mongoose.connect(connectionString);
}

module.exports = connectDB;