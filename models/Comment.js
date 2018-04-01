const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
   username: String,
   userid: String,
   content: String,
   created: Date,
   dogid: String,
   palid: String,
   palname: String,
   city: String,
   state: String
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;