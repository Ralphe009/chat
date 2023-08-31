const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  }],
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;
