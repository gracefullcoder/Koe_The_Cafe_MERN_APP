const mongoose = require('mongoose');

connectDB()
  .then(() => {
    console.log("Connection was succesfull");
  })
  .catch(err => console.log(err));

async function connectDB() {
  const connectionString = 'mongodb+srv://vaibhav:Svnit1103@koethecafe.8x5wmra.mongodb.net/';
  await mongoose.connect(connectionString);
}

module.exports = connectDB;