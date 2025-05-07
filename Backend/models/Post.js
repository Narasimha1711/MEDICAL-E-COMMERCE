const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: String,
  content: String,
  date: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  author: {
    name: String,
    avatar: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
