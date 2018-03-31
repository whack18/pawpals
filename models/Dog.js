const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
  picture:      String,
  name:         String,
  breed:        String,
  weight:       String,
  gender:       String,
  age:          Date,
  fixed:        String,
  tempermeant:  String,
  energy_level: String,
  about:        String,


}, { timestamps: true });

let Dog = module.exports = mongoose.model('Dog', dogSchema);