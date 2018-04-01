const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
   username: String,
   userid: String,
   content: String,
   created: Date
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;