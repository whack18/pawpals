const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const dogSchema = new mongoose.Schema({
  owner:        String,
  picture:      [String],
  name:         String,
  breed:        String,
  weight:       String,
  gender:       String,
  age:          Date,
  fixed:        String,
  temperament:  String,
  energy_level: String,
  about:        String,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

let Dog = module.exports = mongoose.model('Dog', dogSchema);
