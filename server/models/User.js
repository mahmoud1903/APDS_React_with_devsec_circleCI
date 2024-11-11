const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userCode: {
    type: String,
    unique: true,
    default: function () {
      return Math.random().toString(36).substring(2, 10); // Generates a random unique user code
    }
  },
  role: {
    type: String,
    enum: ['user', 'employee', 'admin'], // Restrict role to specified values
    default: 'user' // Default role is 'user'
  }
});

// Static method to hash passwords
UserSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Middleware to hash password before saving if modified
/*UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});*/

module.exports = mongoose.model('User', UserSchema);
