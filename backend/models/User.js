const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['patient', 'doctor', 'admin'],
            required: true,
        },
        // For doctors only
        licenseCID: {
            type: String,
        },
        specialization: {
            type: String,
        },
        isApproved: {
            type: Boolean,
            default: false, // Admin must approve doctor profiles
        },
        rejectionReason: {
            type: String, // Reason for rejection (if applicable)
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);