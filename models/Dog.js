const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
  name: String,
  owner: String
}, { timestamps: true });

let Dog = module.exports = mongoose.model('Dog', dogSchema);