const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileType: { type: String, required: true },
  tags: [String],
  views: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileUrl: { type: String },  

},{
  timestamps: true 
});

module.exports = mongoose.model('File', fileSchema);
