const mongoose = require('mongoose');
const crypto = require('crypto');

const tenantSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Tenant name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    maxlength: [50, 'Slug cannot exceed 50 characters'],
  },
  billingEmail: {
    type: String,
    required: [true, 'Billing email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  supportEmail: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  contactPhone: {
    type: String,
    trim: true,
  },

  commission: {
    type: {
      type: String,
      enum: ['percentage', 'flat'],
      required: true
    },
    rate: {
      type: Number,
      required: true,
      validate: {
        validator: function(v) {
          // Only allows 1.5 if type is percentage, or 500 if type is flat
          return (this.type === 'percentage' && v === 1.5) || 
                 (this.type === 'flat' && v === 500);
        },
        message: 'Rate must match the hardcoded business rules.'
      }
    }
  },

  bankAccount: {
    accountNumber: {
      type: String,
      required: [true, 'Bank account number is required'],
      trim: true,
    },
    bankCode: {
      type: String,
      required: [true, 'Bank code is required'],
      trim: true,
    },
    accountName: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    verificationData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  

})


module.exports = mongoose.model('Tenant', tenantSchema);