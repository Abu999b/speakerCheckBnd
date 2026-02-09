const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    programDate: {
      type: Date,
      default: null
    },
    programTime: {
      type: String,
      default: null
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    lockedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Method to check if speaker is available
speakerSchema.methods.isCurrentlyAvailable = function() {
  if (this.availability.isAvailable) return true;
  
  // Check if the program date has passed
  if (this.availability.programDate) {
    const programDateTime = new Date(this.availability.programDate);
    const now = new Date();
    
    if (programDateTime < now) {
      // Program has passed, make available again
      return true;
    }
  }
  
  return false;
};

module.exports = mongoose.model('Speaker', speakerSchema);